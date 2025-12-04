export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface ReportData {
  period: string;
  cash: number;
  qr: number;
  totalRevenue: number;
  topItems: TopItem[];
}

export const mockReportData: Record<string, ReportData> = {
  "Hari Ini": {
    period: "HARI INI",
    cash: 125000,
    qr: 80000,
    totalRevenue: 205000, // 125k + 80k
    topItems: [
      // Nasi Goreng (8 unit * 12000) = 96000
      { name: "Nasi Goreng", quantity: 8, revenue: 96000 },
      // Mie Ayam (5 unit * 12000) = 60000
      { name: "Mie Ayam", quantity: 5, revenue: 60000 },
      // Es Teh (15 unit * 5000) = 75000
      { name: "Es Teh", quantity: 15, revenue: 75000 },
    ],
  },
  "7 Hari Terakhir": {
    period: "7 HARI TERAKHIR",
    cash: 850000,
    qr: 420000,
    totalRevenue: 1270000, // 850k + 420k
    topItems: [
      // Nasi Goreng (55 unit * 12000) = 660000
      { name: "Nasi Goreng", quantity: 55, revenue: 660000 },
      // Ayam Geprek (30 unit * 13000) = 390000
      { name: "Ayam Geprek", quantity: 30, revenue: 390000 },
      // Soto (20 unit * 10000) = 200000
      { name: "Soto", quantity: 20, revenue: 200000 },
    ],
  },
  "1 Bulan Terakhir": {
    period: "1 BULAN TERAKHIR",
    cash: 3200000,
    qr: 1800000,
    totalRevenue: 5000000, // 3.2M + 1.8M
    topItems: [
      // Nasi Goreng (210 unit * 12000) = 2520000
      { name: "Nasi Goreng", quantity: 210, revenue: 2520000 },
      // Mie Ayam (150 unit * 12000) = 1800000
      { name: "Mie Ayam", quantity: 150, revenue: 1800000 },
      // Es Teh (500 unit * 5000) = 2500000
      { name: "Es Teh", quantity: 500, revenue: 2500000 },
    ],
  },
};
