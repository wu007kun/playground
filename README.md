# 更新
**2021-04-26**
- 实现整个实例的销毁方法  
**2021-02-08**
- 实现编辑时可拖拽  
- 设置坐标和设置cursor分离，解决鼠标在entity上时设置坐标和十字线失效

# 功能备注
事件option有一个permeate属性，仅对sandbox有效，表示该事件sandbox被其他元素遮挡时，是否能渗透到sandbox上。例如鼠标移动到其他元素上时，仍然能触发sandbox的mousemove。在绘制拖动的时候用到。

# 开发计划
  - 拖动和缩放操作封装到库中
  - canvas元素封装到库中，业务代码中创建div并传入constructor作为wrap element
  - polygon和rect继承自同一个class overlay
  - 完善销毁方法
  - 性能优化
  - 实现按键鼠标操作（按住ctrl拖动）
  - 是否有分多层canvas的必要
  - 导出数据  
  - 读取本地文件夹  
