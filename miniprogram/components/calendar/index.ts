Component({
    data: {
      year: 0,
      month: 0,
      days: [],
      selectedDate: '',
      weekDays: ['一', '二', '三', '四', '五', '六', '日']
    },
    lifetimes: {
      attached() {
        const today = new Date()
        this.renderCalendar(today.getFullYear(), today.getMonth())
      }
    },
    methods: {
      renderCalendar(year: number, month: number) {
        const firstDay = new Date(year, month, 1).getDay() || 7
        const totalDays = new Date(year, month + 1, 0).getDate()
        const days = []
  
        for (let i = 1; i < firstDay; i++) {
          days.push({ day: '', dateString: '' }) // 填充空格
        }
  
        for (let d = 1; d <= totalDays; d++) {
          const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
          days.push({ day: d, dateString: dateStr })
        }
  
        this.setData({ year, month, days })
      },
  
      onDateSelect(e: any) {
        const date = e.currentTarget.dataset.date
        if (!date) return
        this.setData({ selectedDate: date })
        this.triggerEvent('select', { date })
      }
    }
  })
  