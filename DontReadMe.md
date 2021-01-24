开发计划

1. 矩形改为鼠标按住拉出来
2. 多边形在mousemove时即绘制
——————————————————————————————
3. 鼠标手势cursor
4. 每个标记的显示、隐藏，命名
5. 缩放
  加载一张图片时自动适配宽度1000，高度超出隐藏，并提示原始尺寸
  缩放用transform: scale实现
6. 鼠标移动实时显示坐标值
7. 鼠标移动时十字线
8. 边框线
9. 再封装一层，或者把一些方法提到.vue文件外


————————————————————————————————————
注意变量按引用传递的污染
polygon和rect修改为继承自同一个class overlay

备忘：
off不传callback时，是取消该entity该类型的的所有事件（清空Set）

on('click', callback, option)

Object |   key    | value |
          click   |  Map  | entityId: Set (callback1, callback2, callback3)
        mousedown |  Map  |
        mouseup   |  Map  |
        mousemove |  Map  |

{
  handler: callback,
  option: {
    permeate: true
  }
}
