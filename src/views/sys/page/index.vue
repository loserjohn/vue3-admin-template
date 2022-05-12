<!--
 * @Author       : xh
 * @Date         : 2022-05-12 19:36:54
 * @LastEditors  : xh
 * @LastEditTime : 2022-05-12 20:59:11
 * @FilePath     : \vue3-admin-template\src\views\sys\page\index.vue
-->
<template>
  <div class="cm_pages">
     <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="Author" width="110" align="center">
        <template #default="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template #default="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="110" align="center">
        <template #default="scope">
          <el-tag :type="statusFilter(scope.row.status)">{{ statusFilter(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import useCommon from '@/hooks/useBase.js'
import { onMounted } from 'vue';
  const {  pageNum,
    pageSize,
    handleCurrentChange,
    handleSizeChange,listLoading ,init,getList,dataList} =  useCommon()


  onMounted(()=>{
     init({
       baseUrl:'/menuss',
       key:'id',
     })

     getList()
  })
</script>

<style lang="scss" scoped>
  .cm_pages{
    
  }
</style>