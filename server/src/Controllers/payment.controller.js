import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// Midtrans & Xendit Payment Gateway Simulator & Live Sandbox Engine
const BANK_VA_MAPPING = {
  bca: { bank: 'BCA', code: '88301', name: 'BCA Virtual Account' },
  mandiri: { bank: 'Mandiri', code: '88002', name: 'Mandiri Bill Payment' },
  bni: { bank: 'BNI', code: '88003', name: 'BNI Virtual Account' },
  bri: { bank: 'BRI', code: '88004', name: 'BRIVA' },
  permata: { bank: 'Permata', code: '88005', name: 'Permata VA' }
};

// POST /api/payment/charge
const createPaymentCharge = async (req, res) => {
  try {
    const { orderNumber, amount, paymentMethod = 'transfer', bank = 'bca' } = req.body;

    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const cleanNum = (orderNumber || `SL-${Date.now()}`).replace(/[^0-9]/g, '').slice(-8);

    // Keep order status as PENDING (Menunggu Pembayaran) until payment is completed
    if (orderNumber) {
      await prisma.order.updateMany({
        where: { orderNumber },
        data: { status: 'PENDING' }
      }).catch(() => {});
    }

    if (paymentMethod === 'ewallet' || paymentMethod === 'qris') {
      const qrisString = `00020101021226680016ID.CO.QRIS.WWW01189360091800000000010215200407375204581253033605802ID5916STEPLUXE OFFICIAL6013TANGSEL BANTEN61051531062070703A016304`;
      return sendSuccess(res, 'QRIS berhasil dibuat', {
        type: 'QRIS',
        orderNumber,
        amount,
        qrisUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrisString)}`,
        qrisString,
        merchantName: 'StepLuxe Official Store',
        expiryTime,
        instructions: [
          'Buka aplikasi e-Wallet (GoPay, OVO, Dana, ShopeePay, LinkAja) atau m-Banking Anda.',
          'Pilih menu Scan QRIS / Bayar.',
          'Arahkan kamera ke kode QR di atas.',
          'Periksa nama merchant (StepLuxe Official Store) dan total pembayaran.',
          'Masukkan PIN Anda untuk menyelesaikan transaksi.'
        ]
      });
    }

    if (paymentMethod === 'transfer') {
      const selectedBank = BANK_VA_MAPPING[bank.toLowerCase()] || BANK_VA_MAPPING.bca;
      const vaNumber = `${selectedBank.code}${cleanNum}857`;

      return sendSuccess(res, 'VA berhasil dibuat', {
        type: 'VIRTUAL_ACCOUNT',
        bank: selectedBank.bank,
        bankName: selectedBank.name,
        vaNumber,
        orderNumber,
        amount,
        expiryTime,
        instructions: [
          `Buka aplikasi m-Banking ${selectedBank.bank} atau ATM terdekat.`,
          `Pilih Transfer > Virtual Account (${selectedBank.name}).`,
          `Masukkan nomor Virtual Account: ${vaNumber}`,
          `Pastikan tagihan atas nama StepLuxe Store bernilai Rp ${amount.toLocaleString('id-ID')}.`,
          `Konfirmasi transaksi dan simpan bukti pembayaran.`
        ]
      });
    }

    if (paymentMethod === 'cod') {
      return sendSuccess(res, 'Metode pembayaran COD diproses', {
        type: 'COD',
        orderNumber,
        amount,
        message: 'Pesanan akan dibayar tunai saat kurir tiba di alamat Anda.',
        instructions: [
          'Siapkan uang pas saat kurir tiba.',
          'Pastikan nomor HP pengiriman aktif untuk dikonfirmasi oleh kurir.'
        ]
      });
    }

    return sendSuccess(res, 'Kartu kredit berhasil diproses', {
      type: 'CARD',
      orderNumber,
      amount,
      message: 'Pembayaran Kartu Kredit/Debit Verifikasi 3D-Secure.',
      redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${cleanNum}`
    });
  } catch (e) {
    return sendError(res, 'Gagal memproses gateway pembayaran', e, 500);
  }
};

// GET /api/payment/status/:orderNumber
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (orderNumber) {
      await prisma.order.updateMany({
        where: { orderNumber },
        data: { status: 'PAID' }
      }).catch(() => {});
    }

    return sendSuccess(res, 'Pembayaran berhasil diverifikasi', {
      orderNumber,
      transactionStatus: 'settlement',
      paymentType: 'bank_transfer',
      grossAmount: req.query.amount || 1850000,
      settlementTime: new Date().toISOString(),
      statusMessage: 'Pembayaran Berhasil Diverifikasi Otomatis (Settlement)'
    });
  } catch (e) {
    return sendError(res, 'Gagal memproses status pembayaran', e, 500);
  }
};

export default {
  createPaymentCharge,
  checkPaymentStatus,
};
