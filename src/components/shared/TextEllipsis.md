# TextEllipsis 多行文本省略组件

一个支持多行文本省略的 React 组件，当文本内容超过指定行数时显示省略号，鼠标悬停时通过自定义 Popover 显示完整内容。

## 功能特性

- ✅ 支持自定义最大显示行数
- ✅ 自动检测文本是否溢出
- ✅ 使用自定义 Popover 显示完整内容
- ✅ 支持多种触发方式（hover、click、focus）
- ✅ 支持自定义 Popover 显示位置
- ✅ 响应式设计，支持窗口大小变化
- ✅ 不显示 Popover 标题，只显示内容

## 安装依赖

无需安装额外依赖，组件使用纯 React 和 CSS 实现。

## 基础用法

```tsx
import TextEllipsis from '@/components/shared/TextEllipsis';

function App() {
  const longText = "这是一段很长的文本内容...";
  
  return (
    <TextEllipsis>
      {longText}
    </TextEllipsis>
  );
}
```

## API 参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| children | 要显示的文本内容 | string | - |
| maxLines | 最大显示行数 | number | 2 |
| className | 文本样式类名 | string | '' |
| style | 文本样式 | React.CSSProperties | {} |
| trigger | Popover 触发方式 | 'hover' \| 'click' \| 'focus' | 'hover' |
| placement | Popover 显示位置 | PopoverProps['position'] | 'top' |

## 使用示例

### 自定义行数

```tsx
<TextEllipsis maxLines={3}>
  {longText}
</TextEllipsis>
```

### 点击触发

```tsx
<TextEllipsis 
  maxLines={2} 
  trigger="click"
  placement="bottom"
>
  {longText}
</TextEllipsis>
```

### 自定义样式

```tsx
<TextEllipsis 
  maxLines={2}
  className="text-blue-600 font-medium"
  style={{ fontSize: '16px', lineHeight: '1.6' }}
>
  {longText}
</TextEllipsis>
```

## 技术实现

- 使用 CSS 的 `-webkit-line-clamp` 实现多行省略
- 通过比较 `scrollHeight` 和 `clientHeight` 检测文本溢出
- 使用 `ResizeObserver` 监听元素大小变化
- 使用自定义 Popover 组件，无需外部依赖

## 浏览器兼容性

- Chrome 6+
- Firefox 68+
- Safari 5+
- Edge 79+

## 注意事项

1. 组件会自动检测文本是否溢出，未溢出时不显示 Popover
2. Popover 不显示标题，只显示内容
3. 支持响应式设计，窗口大小变化时会重新检测
4. 建议为长文本设置合适的最大宽度
