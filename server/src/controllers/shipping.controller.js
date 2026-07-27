import { success, error } from '../utils/apiResponse.js';

// Base rates for Indonesian Courier services per kg (1000g)
const COURIER_BASE_RATES = {
  jne: [
    { service: 'JNE REG', label: 'JNE Regular', code: 'REG', pricePerKg: 15000, eta: '2-3 Hari', icon: '🚚' },
    { service: 'JNE YES', label: 'JNE Yakin Esok Sampai', code: 'YES', pricePerKg: 28000, eta: '1 Hari', icon: '⚡' },
    { service: 'JNE OKE', label: 'JNE Ongkos Kirim Ekonomis', code: 'OKE', pricePerKg: 11000, eta: '3-5 Hari', icon: '📦' },
  ],
  jnt: [
    { service: 'J&T EZ', label: 'J&T Express (EZ)', code: 'EZ', pricePerKg: 14000, eta: '2-3 Hari', icon: '🚚' },
    { service: 'J&T DOC', label: 'J&T Document / Fast', code: 'FAST', pricePerKg: 25000, eta: '1 Hari', icon: '⚡' },
  ],
  sicepat: [
    { service: 'SiCepat REG', label: 'SiCepat Regular', code: 'REG', pricePerKg: 12000, eta: '1-2 Hari', icon: '🚚' },
    { service: 'SiCepat BEST', label: 'SiCepat Besok Sampai Tujuan', code: 'BEST', pricePerKg: 22000, eta: '1 Hari', icon: '⚡' },
    { service: 'SiCepat HALU', label: 'SiCepat Halu (Hemat Alami)', code: 'HALU', pricePerKg: 9500, eta: '3-4 Hari', icon: '🏷️' },
  ],
  anteraja: [
    { service: 'Anteraja Regular', label: 'Anteraja Reg', code: 'REG', pricePerKg: 11500, eta: '2 Hari', icon: '🚚' },
    { service: 'Anteraja NextDay', label: 'Anteraja Next Day', code: 'ND', pricePerKg: 23000, eta: '1 Hari', icon: '⚡' },
  ],
  pos: [
    { service: 'Pos Kilat Khusus', label: 'Pos Indonesia Kilat', code: 'KILAT', pricePerKg: 13000, eta: '2-4 Hari', icon: '📮' },
  ],
  gosend: [
    { service: 'GoSend Same Day', label: 'GoSend Same Day (Instant)', code: 'SAMEDAY', pricePerKg: 35000, eta: 'Hari ini (Max 6 Jam)', icon: '🛵' },
  ]
};

// GET /api/shipping/couriers
export const getCouriers = (req, res) => {
  return success(res, [
    { id: 'jne', name: 'JNE Express', logo: '🔴' },
    { id: 'jnt', name: 'J&T Express', logo: '🔴' },
    { id: 'sicepat', name: 'SiCepat Express', logo: '🔴' },
    { id: 'anteraja', name: 'Anteraja', logo: '🟣' },
    { id: 'pos', name: 'Pos Indonesia', logo: '🟠' },
    { id: 'gosend', name: 'GoSend / Grab', logo: '🟢' },
  ]);
};

// POST /api/shipping/calculate
export const calculateRates = (req, res) => {
  try {
    const { city = 'Jakarta', weightGrams = 1000, courier } = req.body;

    const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
    const isJabodetabek = ['jakarta', 'bogor', 'depok', 'tangerang', 'bekasi'].some(c => city.toLowerCase().includes(c));
    const isOutsideJava = ['medan', 'makassar', 'padang', 'bali', 'denpasar', 'palembang', 'banjarmasin', 'pontianak', 'manado'].some(c => city.toLowerCase().includes(c));

    const distanceMultiplier = isOutsideJava ? 1.8 : (isJabodetabek ? 1.0 : 1.3);

    let couriersToCalculate = [];
    if (courier && COURIER_BASE_RATES[courier]) {
      couriersToCalculate = [{ id: courier, services: COURIER_BASE_RATES[courier] }];
    } else {
      couriersToCalculate = Object.keys(COURIER_BASE_RATES).map(k => ({ id: k, services: COURIER_BASE_RATES[k] }));
    }

    const rates = [];
    couriersToCalculate.forEach(c => {
      c.services.forEach(s => {
        const calculatedPrice = Math.round(s.pricePerKg * weightKg * distanceMultiplier / 500) * 500;
        rates.push({
          id: `${c.id}-${s.code.toLowerCase()}`,
          courierId: c.id,
          courierName: c.id.toUpperCase(),
          service: s.service,
          label: s.label,
          code: s.code,
          price: calculatedPrice,
          eta: s.eta,
          icon: s.icon,
          weightKg,
        });
      });
    });

    return success(res, {
      origin: 'Tangerang Selatan, Banten (Gudang Utama StepLuxe)',
      destination: city,
      weightGrams,
      totalCouriers: rates.length,
      rates,
    });
  } catch (e) {
    return error(res, 'Gagal menghitung ongkir', 500);
  }
};

// GET /api/shipping/track/:waybill
export const trackWaybill = (req, res) => {
  const { waybill } = req.params;
  const courier = (req.query.courier || 'jne').toUpperCase();

  const now = new Date();
  const dateFormatted = (minusHours = 0) => {
    const d = new Date(now.getTime() - minusHours * 3600 * 1000);
    return `${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const timeline = [
    { status: 'DELIVERED', title: 'Paket Terkirim', description: 'Paket telah diterima oleh YBS / Penerima Alamat.', timestamp: dateFormatted(1), done: true },
    { status: 'WITH_COURIER', title: 'Sedang Dibawa Kurir', description: `Kurir ${courier} sedang menuju ke alamat tujuan pengiriman.`, timestamp: dateFormatted(4), done: true },
    { status: 'ARRIVED_DESTINATION', title: 'Tiba di Hub Kota Tujuan', description: 'Paket tiba di Sort Center / Gateway cabang kota tujuan.', timestamp: dateFormatted(10), done: true },
    { status: 'DEPARTED_WAREHOUSE', title: 'Dalam Perjalanan (Transit)', description: 'Paket telah dikirim dari Transit Hub Tangerang Selatan.', timestamp: dateFormatted(18), done: true },
    { status: 'PICKED_UP', title: 'Paket Di-Pick Up Kurir', description: `Paket diserahkan oleh StepLuxe Store ke Kurir ${courier}.`, timestamp: dateFormatted(24), done: true },
    { status: 'ORDER_CREATED', title: 'Pesanan Dibuat', description: 'Resi pengiriman otomatis diterbitkan oleh sistem.', timestamp: dateFormatted(26), done: true },
  ];

  return success(res, {
    waybill: waybill || `SL-RESI-${Date.now().toString().slice(-6)}`,
    courier,
    status: 'DELIVERED',
    sender: 'StepLuxe Official Store (Tangerang Selatan)',
    receiver: 'Pelanggan StepLuxe',
    lastUpdate: dateFormatted(1),
    timeline,
  });
};
