import { Task } from '../../components/entity/task';
Component({
    properties: {
      tasks: {
        type: Array,
        value: [] as Task[],
      },
      layout: {
        type: String,
        value: 'double'
      },
      showDesc: {
        type: Boolean,
        value: false
      }
    },
    methods: {
      handleTaskClick(e: WechatMiniprogram.BaseEvent) {
        const { index } = e.currentTarget.dataset;
        const tasks = [...this.data.tasks];
        tasks[index].status = tasks[index].status === 1 ? 0 : 1;
        this.setData({ tasks });
        this.triggerEvent('statuschange', { index, status: tasks[index].status });
      }
    }
});
