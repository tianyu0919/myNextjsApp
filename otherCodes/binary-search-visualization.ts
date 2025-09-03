/**
 * 二分查找可视化演示
 */
const visualizeBinarySearch = () => {
  // 示例歌词数据（按时间排序）
  const lyrics = [
    { id: '1', time: '00:00', text: '第一句' },
    { id: '2', time: '00:30', text: '第二句' },
    { id: '3', time: '01:00', text: '第三句' },
    { id: '4', time: '01:30', text: '第四句' },
    { id: '5', time: '02:00', text: '第五句' },
    { id: '6', time: '02:30', text: '第六句' },
    { id: '7', time: '03:00', text: '第七句' },
    { id: '8', time: '03:30', text: '第八句' }
  ];
  
  const currentTime = 60; // 01:00 (60秒)
  
  console.log('二分查找可视化演示：');
  console.log('目标时间：01:00 (60秒)');
  console.log('歌词数组：', lyrics.map(l => l.time).join(' '));
  console.log('\n查找过程：\n');
  
  let left = 0;
  let right = lyrics.length - 1;
  let currentIndex = -1;
  let step = 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const item = lyrics[mid];
    const [minute, second] = item.time.split(':');
    const startTime = Number(minute) * 60 + Number(second);
    
    // 可视化当前状态
    console.log(`步骤${step}:`);
    console.log(`  搜索范围: [${left}, ${right}]`);
    console.log(`  中间位置: ${mid} (时间: ${item.time})`);
    console.log(`  当前时间: ${currentTime}s, 歌词时间: ${startTime}s`);
    
    if (currentTime >= startTime) {
      console.log(`  ${currentTime}s >= ${startTime}s ✓ 向右查找`);
      currentIndex = mid;
      left = mid + 1;
    } else {
      console.log(`  ${currentTime}s < ${startTime}s ✗ 向左查找`);
      right = mid - 1;
    }
    
    console.log(`  更新范围: [${left}, ${right}]\n`);
    step++;
  }
  
  const result = currentIndex >= 0 ? lyrics[currentIndex] : null;
  console.log(`最终结果: ${result ? result.time : '未找到'}`);
  console.log(`对应歌词: ${result ? result.text : '无'}`);
};

// 运行可视化演示
visualizeBinarySearch();
