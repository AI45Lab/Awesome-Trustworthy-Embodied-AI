<template>
  <v-container class="project-page" fluid>
    <!-- 标题部分 -->
    <div class="header">
      <h1 class="title">
        <v-icon large class="title-icon">mdi-database-search</v-icon>
        Awesome Trustworthy Embodied-AI
      </h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-container">
      <v-row class="search-row" align="center">
        <v-text-field
          v-model="searchKeyword"
          class="search-input"
          outlined
          prepend-inner-icon="mdi-magnify"
          placeholder="Search papers by title, author, or keywords..."
          clearable
          @keyup.enter="filterPapers"
          hide-details
        >
          <template v-slot:prepend>
            <div class="csv-icon">📄</div>
          </template>
        </v-text-field>
        <v-btn 
          class="search-btn"
          dark
          elevation="0"
          @click="filterPapers"
        >
          <v-icon left>mdi-database-search</v-icon>
          Search
        </v-btn>
      </v-row>

      <!-- 搜索统计信息 -->
      <div class="search-stats" v-if="searchKeyword || selectedTags.length > 0">
        <v-chip 
          small 
          color="blue lighten-4" 
          text-color="blue darken-3"
          class="ma-1"
        >
          <v-icon small left>mdi-file-document-multiple</v-icon>
          {{ filteredPapers.length }} papers found
        </v-chip>
        <v-chip 
          v-if="searchKeyword"
          small 
          color="green lighten-4" 
          text-color="green darken-3"
          class="ma-1"
          close
          @click:close="clearSearch"
        >
          <v-icon small left>mdi-magnify</v-icon>
          "{{ searchKeyword }}"
        </v-chip>
      </div>

      <!-- 二维表格容器 -->
      <div class="tag-matrix-container">
        <h3 class="text-center mb-4">
          <v-icon color="blue darken-2">mdi-grid</v-icon>
          Filter by Categories
          <div class="csv-icon">📊</div>
        </h3>
        <tag-matrix :onTagClick="handleTagFilter"></tag-matrix>
        
        <!-- 活跃过滤器显示 -->
        <div class="active-filters" v-if="activeFilter">
          <v-divider class="my-4"></v-divider>
          <div class="text-center">
            <v-chip 
              color="blue" 
              dark 
              close
              @click:close="clearTagFilter"
            >
              <v-icon small left>mdi-filter</v-icon>
              {{ activeFilter }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- 论文列表 -->
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="9" v-for="paper in filteredPapers" :key="paper.title + paper.date">
          <paper-card :paper="paper"></paper-card>
        </v-col>
      </v-row>
      
      <!-- 空状态提示 -->
      <v-row v-if="filteredPapers.length === 0" justify="center">
        <v-col cols="12" class="empty-state">
          <v-icon x-large color="grey lighten-1">mdi-file-search-outline</v-icon>
          <p class="mt-4">No papers found matching your criteria</p>
          <div class="mt-4">
            <v-btn 
              color="blue lighten-2" 
              text
              class="mr-3"
              @click="resetFilters"
            >
              <v-icon left>mdi-refresh</v-icon>
              Reset Filters
            </v-btn>
            <v-btn 
              color="green lighten-2" 
              text
              @click="showAllPapers"
            >
              <v-icon left>mdi-eye</v-icon>
              Show All Papers
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 返回顶部按钮 -->
    <v-btn
      v-show="showBackToTop"
      fab
      dark
      fixed
      bottom
      right
      color="blue darken-2"
      @click="scrollToTop"
      class="back-to-top-btn"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import PaperCard from '@/components/PaperCard.vue'
import TagMatrix from '@/components/TagMatrix.vue'
import csvData from '@/data/paper_list.csv'

export default {
  components: { PaperCard, TagMatrix },
  data() {
    return {
      papers: [],
      searchKeyword: '',
      selectedTags: [],
      filteredPapers: [],
      activeFilter: '',
      showBackToTop: false
    }
  },
  created() {
    this.processCSVData(csvData)
    this.filteredPapers = this.papers
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.showBackToTop = window.scrollY > 300
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    resetFilters() {
      this.searchKeyword = ''
      this.selectedTags = []
      this.activeFilter = ''
      this.filteredPapers = this.papers
    },
    clearSearch() {
      this.searchKeyword = ''
      this.filterPapers()
    },
    clearTagFilter() {
      this.activeFilter = ''
      this.filterPapers()
    },
    showAllPapers() {
      this.resetFilters()
    },
    processCSVData(rawData) {
      this.papers = rawData
        .map(row => {
          // 处理可能为空的字段
          const safeSplit = (str) => 
            str ? str.split(',').map(s => s.trim()).filter(Boolean) : []
          
          return {
            title: row['标题'] || '',
            date: row['发表年月'] || '',
            author: row['一作'] || '',
            authorOrg: row['一作单位'] || '',
            contact: row['通讯'] || '',
            contactOrg: row['通讯单位'] || '',
            macros: safeSplit(row['宏观维度']),
            apps: safeSplit(row['应用维度']),
            tasks: safeSplit(row['具身任务']),
            method: safeSplit(row['方法论']),
            link: row['链接'] || ''
          }
        })
        // 过滤掉没有标题的论文
        .filter(paper => paper.title.trim() !== '')
    },
    filterPapers() {
      let filtered = this.papers

      // 应用搜索关键词过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(keyword) ||
          p.author.toLowerCase().includes(keyword) ||
          p.contact.toLowerCase().includes(keyword) ||
          p.macros.some(tag => tag.toLowerCase().includes(keyword)) ||
          p.apps.some(tag => tag.toLowerCase().includes(keyword)) ||
          p.tasks.some(tag => tag.toLowerCase().includes(keyword)) ||
          p.method.some(tag => tag.toLowerCase().includes(keyword))
        )
      }

      // 应用标签过滤
      if (this.activeFilter) {
        const [tag1, tag2] = this.activeFilter.split('/')
        filtered = filtered.filter(p =>
          p.macros.includes(tag1) && p.apps.includes(tag2)
        )
      }

      this.filteredPapers = filtered
    },
    handleTagFilter(tag1, tag2) {
      this.activeFilter = `${tag1}/${tag2}`
      this.filterPapers()
    }
  },
  watch: {
    searchKeyword() {
      // 实时搜索
      if (this.searchKeyword.length > 2 || this.searchKeyword.length === 0) {
        this.filterPapers()
      }
    }
  }
}
</script>

<style scoped>
.search-stats {
  text-align: center;
  margin-top: 20px;
  margin-bottom: -10px;
}

.active-filters {
  margin-top: 15px;
}

.back-to-top-btn {
  z-index: 999;
}

.csv-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
}
</style>