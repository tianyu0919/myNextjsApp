// 测试二分查找和Filter方法的性能

// 定义歌词项接口
interface LyricItem {
  id: string;
  time: string;
  text: string;
}

type LyricType = 'musicLibrary' | 'asr';

/**
 * 二分查找方法
 */
const setLyricBinarySearch = (
  currentTime: number, 
  lyric: LyricItem[], 
  type: LyricType, 
  setCurrentLyric: (id: string | undefined) => void
) => {
  if (lyric.length === 0) {
    setCurrentLyric(undefined);
    return;
  }

  let left = 0;
  let right = lyric.length - 1;
  let currentIndex = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const item = lyric[mid];
    let startTime = 0;

    if (type === 'musicLibrary') {
      const [minute, second] = item.time.split(':');
      startTime = Number(minute) * 60 + Number(second);
    } else if (type === 'asr') {
      const [start, end] = item.time.split('~');
      const [hour, minute, second] = start.split(':');
      startTime = Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second);
    }

    if (currentTime >= startTime) {
      currentIndex = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  const _currentLyric = currentIndex >= 0 ? lyric[currentIndex] : undefined;
  setCurrentLyric(_currentLyric?.id);
};

/**
 * Filter方法
 */
const setLyricFilter = (
  currentTime: number, 
  lyric: LyricItem[], 
  type: LyricType, 
  setCurrentLyric: (id: string | undefined) => void
) => {
  if (lyric.length === 0) {
    setCurrentLyric(undefined);
    return;
  }

  const filterLyric = lyric.filter((item) => {
    if (type === 'musicLibrary') {
      const [minute, second] = item.time.split(':');
      return currentTime >= Number(minute) * 60 + Number(second);
    } else if (type === 'asr') {
      const [start, end] = item.time.split('~');
      const [hour, minute, second] = start.split(':');
      return currentTime >= Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second);
    }
    return false;
  });

  const _currentLyric = filterLyric[filterLyric.length - 1];
  setCurrentLyric(_currentLyric?.id);
};

/**
 * 生成测试数据
 */
const generateTestData = (count: number): LyricItem[] => {
  const lyrics: LyricItem[] = [];
  for (let i = 0; i < count; i++) {
    const minutes = Math.floor(i / 60);
    const seconds = i % 60;
    lyrics.push({
      id: `lyric-${i}`,
      time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      text: `歌词 ${i}`
    });
  }
  return lyrics;
};

/**
 * 性能测试函数
 */
const performanceTest = () => {
  const testSizes = [10, 100, 1000, 10000];
  const currentTime = 300; // 5分钟
  const type: LyricType = 'musicLibrary';
  let result: string | undefined;

  console.log('性能测试结果：\n');
  console.log('数据量\t\t二分查找(ms)\tFilter(ms)\t性能提升倍数');
  console.log('------------------------------------------------');

  testSizes.forEach(size => {
    const lyrics = generateTestData(size);
    
    // 测试二分查找
    const binaryStart = performance.now();
    for (let i = 0; i < 1000; i++) {
      setLyricBinarySearch(currentTime, lyrics, type, (id) => { result = id; });
    }
    const binaryTime = performance.now() - binaryStart;

    // 测试Filter
    const filterStart = performance.now();
    for (let i = 0; i < 1000; i++) {
      setLyricFilter(currentTime, lyrics, type, (id) => { result = id; });
    }
    const filterTime = performance.now() - filterStart;

    const improvement = filterTime / binaryTime;
    
    console.log(`${size}\t\t${binaryTime.toFixed(2)}\t\t${filterTime.toFixed(2)}\t\t${improvement.toFixed(1)}x`);
  });
};

// 运行性能测试
performanceTest();
