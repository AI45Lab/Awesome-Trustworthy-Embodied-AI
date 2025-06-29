<template>
  <div class="tag-matrix-wrapper">
    <v-simple-table class="tag-matrix">
      <thead>
        <tr>
          <th class="corner-cell">
            <v-icon color="white" small>mdi-grid</v-icon>
          </th>
          <th v-for="col in columns" :key="col" class="column-header">
            <div class="header-content">
              <v-icon small class="header-icon">{{ getColumnIcon(col) }}</v-icon>
              <span>{{ col }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row">
          <th class="row-header">
            <div class="header-content">
              <v-icon small class="header-icon">{{ getRowIcon(row) }}</v-icon>
              <span>{{ row }}</span>
            </div>
          </th>
          <td v-for="col in columns" :key="col" class="matrix-cell">
            <v-btn 
              small 
              elevation="0"
              class="matrix-btn"
              @click="onTagClick(row, col)"
              :title="`筛选: ${row} × ${col}`"
            >
              <v-icon small left>mdi-filter-variant</v-icon>
              <span class="btn-text">{{ row }}/{{ col }}</span>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    
    <!-- 图例说明 -->
    <div class="legend">
      <div class="legend-title">
        <v-icon small color="blue darken-2">mdi-information</v-icon>
        点击表格交叉点进行筛选
      </div>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color legend-row"></div>
          <span>可信维度 (行)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-col"></div>
          <span>应用领域 (列)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagMatrix',
  props: {
    onTagClick: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      columns: [
        '指令理解',  // 原 'Instruction Understanding'
        '环境感知',  // 原 'Environment Perception'
        '决策规划',  // 原 'Behavior Planning'
        '物理交互'   // 原 'Physical Interaction'
      ],
      rows: [
        '无害',     // 原 'Harmless'
        '可靠',     // 原 'Reliable'
        '价值',     // 原 'Value-Aligned'
        '保障',     // 原 'Secure'
        '透明'      // 原 'Transparent'
      ]
    }
  },
  methods: {
    getColumnIcon(col) {
      const icons = {
        '指令理解': 'mdi-message-text',
        '环境感知': 'mdi-eye',
        '决策规划': 'mdi-brain',
        '物理交互': 'mdi-hand-heart'
      }
      return icons[col] || 'mdi-circle'
    },
    getRowIcon(row) {
      const icons = {
        '无害': 'mdi-shield-check',
        '可靠': 'mdi-check-circle',
        '价值': 'mdi-heart',
        '保障': 'mdi-security',
        '透明': 'mdi-eye-outline'
      }
      return icons[row] || 'mdi-circle'
    }
  }
};
</script>

<style scoped>
.tag-matrix-wrapper {
  position: relative;
}

.tag-matrix {
  width: 100%;
  border-collapse: separate;
  border-spacing: 8px;
  margin-bottom: 20px;
}

/* 角落单元格 */
.corner-cell {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6) !important;
  color: white !important;
  border-radius: 10px;
  width: 120px;
  text-align: center;
}

/* 列标题 */
.column-header {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
  color: #1e3a8a !important;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  border: 2px solid rgba(59, 130, 246, 0.2);
  min-width: 130px;
}

/* 行标题 */
.row-header {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6) !important;
  color: white !important;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  width: 120px;
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.9rem;
}

.header-icon {
  opacity: 0.9;
}

/* 矩阵单元格 */
.matrix-cell {
  padding: 6px;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
}

.matrix-cell:hover {
  background: rgba(219, 234, 254, 0.6);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.matrix-cell::before {
  content: '📊';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.matrix-cell:hover::before {
  opacity: 1;
}

/* 矩阵按钮 */
.matrix-btn {
  width: 100%;
  height: 48px;
  min-height: 48px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
  color: #1e3a8a !important;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-transform: none;
  border: 2px solid rgba(59, 130, 246, 0.2) !important;
  overflow: hidden;
}

.matrix-btn:hover {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
  color: #1d4ed8 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25) !important;
  border-color: rgba(59, 130, 246, 0.4) !important;
}

.btn-text {
  font-size: 0.75rem;
  font-weight: 600;
}

/* 图例 */
.legend {
  background: rgba(248, 250, 252, 0.8);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  margin-top: 10px;
}

.legend-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.legend-items {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-row {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.legend-col {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 960px) {
  .tag-matrix {
    border-spacing: 4px;
  }
  
  .column-header,
  .row-header,
  .corner-cell {
    padding: 12px 8px;
    min-width: 100px;
    width: 100px;
  }
  
  .header-content {
    font-size: 0.8rem;
    gap: 4px;
  }
  
  .matrix-btn {
    height: 40px;
    min-height: 40px;
    font-size: 0.7rem;
  }
  
  .btn-text {
    font-size: 0.65rem;
  }
  
  .legend-items {
    gap: 15px;
  }
}

@media (max-width: 600px) {
  .tag-matrix {
    border-spacing: 2px;
  }
  
  .column-header,
  .row-header,
  .corner-cell {
    padding: 8px 4px;
    min-width: 80px;
    width: 80px;
  }
  
  .header-content {
    font-size: 0.7rem;
    flex-direction: column;
    gap: 2px;
  }
  
  .matrix-btn {
    height: 36px;
    min-height: 36px;
  }
  
  .btn-text {
    font-size: 0.6rem;
    line-height: 1.2;
  }
  
  .legend {
    padding: 12px;
  }
  
  .legend-items {
    flex-direction: column;
    gap: 8px;
  }
}
</style>