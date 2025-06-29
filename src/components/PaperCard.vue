<template>
  <v-card class="paper-card" outlined>
    <!-- 论文标题区域 -->
    <v-card-title class="headline">
      <div class="title-wrapper">
        <div class="paper-icon">📄</div>
        <div class="title-content">
          <a :href="paper.link" target="_blank" class="paper-title">
            {{ paper.title }}
          </a>
          <span class="paper-date">{{ paper.date }}</span>
        </div>
      </div>
    </v-card-title>

    <!-- 作者信息 -->
    <v-card-subtitle class="authors-section">
      <div class="authors-row">
        <v-icon small color="blue darken-2" class="mr-2">mdi-account</v-icon>
        <span class="authors">{{ paper.author }}</span>
        <span v-if="paper.contact" class="contact-author">, {{ paper.contact }} et al.</span>
      </div>
      
      <div class="org-row" v-if="paper.authorOrg">
        <v-icon small color="grey darken-1" class="mr-2">mdi-domain</v-icon>
        <span class="authorsOrg">{{ paper.authorOrg }}</span>
      </div>
    </v-card-subtitle>

    <!-- 标签区域 -->
    <v-card-text class="tags-section">
      <div class="tag-group" v-if="paper.macros.length > 0">
        <div class="tag-category">
          <v-icon small color="blue darken-2" class="category-icon">mdi-shield-check</v-icon>
          <span class="category-label">可信维度:</span>
        </div>
        <v-chip
          v-for="macro in paper.macros"
          :key="'macro-' + macro"
          class="ma-1"
          color="blue lighten-4"
          text-color="blue darken-3"
          small
          label
        >
          <v-icon small left>mdi-security</v-icon>
          {{ macro }}
        </v-chip>
      </div>
      
      <div class="tag-group" v-if="paper.apps.length > 0">
        <div class="tag-category">
          <v-icon small color="green darken-2" class="category-icon">mdi-application</v-icon>
          <span class="category-label">应用维度:</span>
        </div>
        <v-chip
          v-for="app in paper.apps"
          :key="'app-' + app"
          class="ma-1"
          color="green lighten-4"
          text-color="green darken-3"
          small
          label
        >
          <v-icon small left>mdi-cog</v-icon>
          {{ app }}
        </v-chip>
      </div>
      
      <div class="tag-group" v-if="paper.tasks.length > 0">
        <div class="tag-category">
          <v-icon small color="purple darken-2" class="category-icon">mdi-robot</v-icon>
          <span class="category-label">具身任务:</span>
        </div>
        <v-chip
          v-for="task in paper.tasks"
          :key="'task-' + task"
          class="ma-1"
          color="purple lighten-4"
          text-color="purple darken-3"
          small
          label
        >
          <v-icon small left>mdi-play</v-icon>
          {{ task }}
        </v-chip>
      </div>

      <div class="tag-group" v-if="paper.method.length > 0">
        <div class="tag-category">
          <v-icon small color="orange darken-2" class="category-icon">mdi-lightbulb</v-icon>
          <span class="category-label">方法论:</span>
        </div>
        <v-chip
          v-for="method in paper.method"
          :key="'method-' + method"
          class="ma-1"
          color="orange lighten-4"
          text-color="orange darken-3"
          small
          label
        >
          <v-icon small left>mdi-flask</v-icon>
          {{ method }}
        </v-chip>
      </div>
    </v-card-text>

    <!-- 论文操作区域 -->
    <v-card-actions class="paper-actions">
      <v-btn
        v-if="paper.link"
        :href="paper.link"
        target="_blank"
        color="blue darken-2"
        text
        small
      >
        <v-icon small left>mdi-open-in-new</v-icon>
        查看论文
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <div class="csv-indicator">
        <div class="csv-icon">📊</div>
        <span class="csv-text">CSV Data</span>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PaperCard',
  props: {
    paper: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.paper-card {
  margin-bottom: 30px;
  border-radius: 16px !important;
  box-shadow: 
    0 8px 25px rgba(59, 130, 246, 0.08),
    0 4px 15px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.4s ease;
  border: 1px solid rgba(59, 130, 246, 0.1) !important;
  background: white;
  overflow: hidden;
  position: relative;
}

.paper-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.paper-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 12px 40px rgba(59, 130, 246, 0.15),
    0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* 标题区域 */
.headline {
  padding: 20px 20px 16px 20px;
}

.title-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.paper-icon {
  font-size: 1.5rem;
  margin-top: 2px;
  opacity: 0.8;
}

.title-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.paper-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  color: #1e3a8a;
  text-decoration: none;
  line-height: 1.4;
  transition: all 0.3s ease;
  display: block;
}

.paper-title:hover {
  color: #3b82f6;
  text-decoration: none;
}

.paper-date {
  font-weight: 500;
  font-size: 0.9rem;
  color: #6b7280;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* 作者信息区域 */
.authors-section {
  padding: 0 20px 16px 20px;
}

.authors-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.authors {
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.contact-author {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.org-row {
  display: flex;
  align-items: center;
}

.authorsOrg {
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
  font-weight: 400;
}

/* 标签区域 */
.tags-section {
  padding: 0 20px 16px 20px;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
  gap: 4px;
}

.tag-group:last-child {
  margin-bottom: 0;
}

.tag-category {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
  min-width: fit-content;
}

.category-icon {
  opacity: 0.8;
}

.category-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
}

/* 标签样式优化 */
.v-chip {
  font-weight: 500 !important;
  font-size: 0.8rem !important;
  height: 28px !important;
  border-radius: 14px !important;
  transition: all 0.2s ease !important;
}

.v-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 特定颜色的标签 */
.v-chip.blue.lighten-4 {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
}

.v-chip.green.lighten-4 {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0) !important;
  border: 1px solid rgba(34, 197, 94, 0.3) !important;
}

.v-chip.purple.lighten-4 {
  background: linear-gradient(135deg, #f3e8ff, #e9d5ff) !important;
  border: 1px solid rgba(147, 51, 234, 0.3) !important;
}

.v-chip.orange.lighten-4 {
  background: linear-gradient(135deg, #fed7aa, #fdba74) !important;
  border: 1px solid rgba(234, 88, 12, 0.3) !important;
}

/* 操作区域 */
.paper-actions {
  padding: 12px 20px 16px 20px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(248, 250, 252, 0.5);
}

.csv-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.7;
}

.csv-icon {
  font-size: 0.9rem;
}

.csv-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .title-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .paper-icon {
    align-self: flex-start;
  }
  
  .paper-title {
    font-size: 1.1rem;
  }
  
  .tag-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .tag-category {
    margin-right: 0;
    margin-bottom: 4px;
  }
  
  .authors-row,
  .org-row {
    flex-wrap: wrap;
  }
}
</style>