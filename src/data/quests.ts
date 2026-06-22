import type { Quest } from '@/types/game';

export function createDefaultQuests(): Quest[] {
  return [
    { id: 'd1', type: 'daily', title: 'Tu luyện 30 phút', description: 'Tích lũy tu vi', icon: '🧘', target: 1800, progress: 0, rewards: [{ type: 'crystal', amount: 500 }, { type: 'gold', amount: 1000 }], claimed: false },
    { id: 'd2', type: 'daily', title: 'Đột phá 1 lần', description: 'Vượt qua bình cảnh', icon: '⚡', target: 1, progress: 0, rewards: [{ type: 'jade', amount: 50 }, { type: 'crystal', amount: 300 }], claimed: false },
    { id: 'd3', type: 'daily', title: 'Thám hiểm phó bản', description: 'Vượt phó bản 3 lần', icon: '🏔️', target: 3, progress: 0, rewards: [{ type: 'gold', amount: 2000 }, { type: 'item', itemId: 'pill_qi' }], claimed: false },
    { id: 'd4', type: 'daily', title: 'Đánh bại Boss', description: 'Hạ gục 1 boss', icon: '👹', target: 1, progress: 0, rewards: [{ type: 'crystal', amount: 800 }, { type: 'jade', amount: 30 }], claimed: false },
    { id: 'd5', type: 'daily', title: 'Đấu pháp đài', description: 'Thắng 2 trận', icon: '⚔️', target: 2, progress: 0, rewards: [{ type: 'gold', amount: 1500 }], claimed: false },
    { id: 'm1', type: 'main', title: 'Bắt đầu con đường tu tiên', description: 'Đạt Trúc Cơ Kỳ', icon: '🌟', target: 1, progress: 0, rewards: [{ type: 'crystal', amount: 5000 }, { type: 'item', itemId: 'pill_break' }], claimed: false },
    { id: 'm2', type: 'main', title: 'Nhập Kim Đan', description: 'Đạt Kim Đan Kỳ', icon: '🔥', target: 1, progress: 0, rewards: [{ type: 'gold', amount: 10000 }, { type: 'item', itemId: 'sword_qingyun' }], claimed: false },
    { id: 'a1', type: 'achievement', title: 'Tu luyện 10 giờ', description: 'Tổng thời gian tu luyện', icon: '⏱️', target: 36000, progress: 0, rewards: [{ type: 'jade', amount: 200 }], claimed: false },
    { id: 'a2', type: 'achievement', title: 'Sưu tập 50 vật phẩm', description: 'Mở rộng túi đồ', icon: '🎒', target: 50, progress: 0, rewards: [{ type: 'crystal', amount: 3000 }], claimed: false },
  ];
}

export const ACTIVITY_MILESTONES = [20, 40, 60, 80, 100];
