import { SlidePhoto } from '../types';

import imgArtFestival from '../assets/images/classroom_art_festival_1791353735576.jpg';
import imgSportsDay from '../assets/images/school_sports_day_1791353749047.jpg';
import imgGraduation from '../assets/images/classroom_graduation_memories_1791353764871.jpg';
import imgPicnic from '../assets/images/classroom_spring_picnic_1791353785272.jpg';

export const SAMPLE_PHOTOS: SlidePhoto[] = [
  {
    id: 'sample-1',
    url: imgArtFestival,
    name: '학급 축제 칠판 아트 & 풍선 장식 추억.jpg',
    isSample: true,
    dateAdded: 1,
  },
  {
    id: 'sample-2',
    url: imgSportsDay,
    name: '가을 운동회 - 푸른 잔디와 응원 깃발.jpg',
    isSample: true,
    dateAdded: 2,
  },
  {
    id: 'sample-3',
    url: imgGraduation,
    name: '졸업식 날 교실 책상과 꽃다발, 앨범.jpg',
    isSample: true,
    dateAdded: 3,
  },
  {
    id: 'sample-4',
    url: imgPicnic,
    name: '봄날 교정 벚꽃 나무 아래 봄 소풍.jpg',
    isSample: true,
    dateAdded: 4,
  },
];
