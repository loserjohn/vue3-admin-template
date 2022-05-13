<!--
 * @Author       : xh
 * @Date         : 2022-05-12 19:36:54
 * @LastEditors  : xh
 * @LastEditTime : 2022-05-13 11:41:46
 * @FilePath     : \vue3-admin-template\src\views\sys\page\index.vue
-->
<template>

  <div class="cm_pages">
     <el-button type="primary" @click="_handleAdd">新增</el-button>
<el-table
      v-loading="_listLoading"
      :data="_dataList"
      :default-expand-all="false"
      :row-key="_uniKey"
      :tree-props="{ children: 'subs', hasChildren: 'hasChildren' }"
      border
      size="default"
    >
      <el-table-column type="index" align="center" width="55" />
      <el-table-column align="left" label="页面名称" prop="display_name" min-width="100px"></el-table-column>
      <el-table-column align="left" label="图标" width="50px">
        <template #default="scope">
          <div class="icon-item">
            <svg-icon :icon-class="scope.row.icon" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="标识" width="180px">
        <template #default="scope">
          <el-input
            v-model="scope.row.name"
            @change="handleChangeListener(scope.row, 'name')"
            @blur="handleProperty(scope.row, 'name')"
          />
        </template>
      </el-table-column>
      <el-table-column align="left" label="设为菜单" width="80px">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_menu"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus(scope.row.id, { is_menu: scope.row.is_menu })"
          />
        </template>
      </el-table-column>
      <el-table-column align="left" label="排序" width="120px">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.sort" 
            :min="1"
            :max="100"
            style="width: 100%"
            @change="handleProperty(scope.row, 'sort')"
          />
        </template>
      </el-table-column>
      <el-table-column align="left" label="备注" prop="mark" min-width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="是否启用" width="80px">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus(scope.row.id, { status: scope.row.status })"
          />
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作">
        <template #default="scope">
          <el-button plain type="primary" size="small" @click="_handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex">
      <el-pagination
        v-model:current-page="_pageNum"
        v-model:page-size="_pageSize"
        background
        :page-sizes="[20, 50, 100]"
        :hide-on-single-page="false"
        layout="prev, pager, next,sizes "
        :_total="_total"
      />
    </div>
  </div>

  <!-- 增删改查 -->
  <el-dialog v-model="_isVisible" :title="_actionType==='edit'?'编辑':'新增'" width="40%" :before-close="_handleClose">
    <el-form ref="ruleForm" :_model="_model" label-width="100px" :rules="formValiteRule" label-position="right">
      <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="父级页面">
              <el-cascader
                v-model="pidArray"
                :options="_dataList"
                placeholder="请选择父级页面"
                clearable
                :change-on-select="true"
                :props="{
                  value: 'id',
                  label: 'display_name',
                  children: 'subs'
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="页面名称" prop="display_name">
            <el-input v-model="_model.display_name" placeholder="请输入页面名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面标识" prop="name">
            <el-input v-model="_model.name" placeholder="请输入页面标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面图标" prop="icon">
            <el-input v-model="_model.icon" readonly placeholder="请选择图标">
              <el-button slot="append" icon="el-icon-search" @click="_select" />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="设为菜单" prop="is_menu">
            <el-switch v-model="_model.is_menu" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="启用标志" prop="status">
            <el-switch v-model="_model.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="_model.sort"  :min="1" :max="100" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="mark">
        <el-input v-model="_model.mark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="_handleSave">保存</el-button>
        <!-- <el-button type="danger" @click="_handleReset">重置</el-button> -->
        <el-button type="default" @click="_handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import useList from '@/hooks/useList.js'
 
// import useEdit from '@/hooks/useEdit.js'
import { onMounted,   } from 'vue'
const searchParams = (data) => {
  data.test = 123
  return data
}
const { _pageNum, _pageSize, _listLoading, _getList, _dataList, _total, _uniKey, _model, _isVisible,_handleAdd ,_handleSave,_handleClose,_actionType,_handleEdit} = useList({
  baseUrl: '/menuss',
  key: 'id',
  bf_searchParams: searchParams,
  defaultModal:{
      pid: 0,
      name: '111',
      icon: '',
      display_name: '222',
      is_menu: 1,
      status: 1,
      mark: '',
      sort: 4,
      level_data: []
  }
})

const formValiteRule = reactive({})
// const {
//   _model,
//   _isVisible,
// } = useEdit({
//     baseUrl: '/menuss',
//     key: 'id',
//     bf_searchParams:searchParams
// })

onMounted(() => {
  _getList()
})
const handleProperty = () => {}
</script>

<style lang="scss" scoped>
.cm_pages {
}
</style>
