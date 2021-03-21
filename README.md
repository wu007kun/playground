# 更新
**2021-02-08**
- 实现编辑时可拖拽  
- 设置坐标和设置cursor分离，解决鼠标在entity上时设置坐标和十字线失效

# 功能备注
事件option有一个permeate属性，仅对sandbox有效，表示该事件sandbox被其他元素遮挡时，是否能渗透到sandbox上。例如鼠标移动到其他元素上时，仍然能触发sandbox的mousemove。在绘制拖动的时候用到。

# 开发计划
  ### 功能
  - 实现按键鼠标操作（按住ctrl拖动）
  - 退出和销毁
  - attachment试试另建一层canvas（否则缩放模糊）
  ### 性能
  - 背景图片方案（分层canvas、用img标签、用CSS background等）  
  
  ### 封装
  - 再封装一层，或者把一些方法提到Index.vue文件外  
  - polygon和rect修改为继承自同一个class overlay

  ### 扩展
  - 导出数据  
  - 读取本地文件夹  
————————————————————————————————————  
注意变量按引用传递的污染

