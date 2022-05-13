/*
 * @Author       : xh
 * @Date         : 2022-05-12 20:46:27
 * @LastEditors  : xh
 * @LastEditTime : 2022-05-13 11:57:03
 * @FilePath     : \vue3-admin-template\src\hooks\useList.js
 */

import request from '@/utils/axiosReq'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { toRef } from 'vue'
export default function (setting) {
  const { bf_searchParams = null, baseUrl = '', key = '', defaultModal = {} } = setting
  const _serveUrl = ref('')
  const _uniKey = ref('id')
  const _isVisible = ref(true)
  /*分页*/
  const _pageNum = ref(1)
  const _pageSize = ref(10)
  const _total = ref(0)
  const _dataList = ref([])

  const _actionType = ref('new')

  const _model = reactive({
    form:{ ...defaultModal},

  })

  // 多选

  const _listLoading = ref(false)

  onMounted(() => {
    _serveUrl.value = baseUrl
    _uniKey.value = key

  })




  // 通用部分
  const _handleCurrentChange = (val) => {
    // debugger
    _pageNum.value = val
    _getList()
  }
  const _handleSizeChange = (val) => {
    _pageSize.value = val
    _getList()
  }




  // 列表
  const _getList = async (val) => {
    try {
      let data = {
        _pageNum: _pageNum.value, _pageSize: _pageSize.value,

      }
      data = _searchParams(data)
      const res = await __getList(_serveUrl.value, { ...data })
      //  console.log('res',res)
      _dataList.value = res.list
      _total.value = res._total
    } catch (error) { }
  }



  // 预制搜索参数构造
  const _searchParams = (data) => {
    if (bf_searchParams && typeof bf_searchParams === 'function') {
      return bf_searchParams(data)
    } else {
      return { ...data }
    }
  }

  // 新增函数
  const _handleAdd = () => {
    _model.form = defaultModal
    _actionType.value = 'new'
    _isVisible.value = true
    console.log('_handleAdd', _model.form)
  }
  const _handleDoAdd = async () => {

  }

  //编辑
  const _handleEdit = async (scope) => {
    if (scope && scope.row) {
      _model.form = scope.row
      // debugger
      console.log('_handleEdit', _model.form)
    } else {
      try {
        const res = await __getDetail(_serveUrl.value, scope.row[_uniKey.value])
        _model.form = res

      } catch (error) {

      }
    }
    _actionType.value = 'edit'
    _isVisible.value = true
  }
  const _handleDoEdit = async () => {

  }

  //保存
  const _handleSave = () => {
    if (_actionType.value === 'new') {
      _handleDoAdd()
    }
  }
  const _handleClose = () => {
    _model.form = defaultModal
    _isVisible.value = false
  }
 



  watch([_pageNum, _pageSize], (newValue, oldValue) => {
    _getList()
  })


  const {form  } =  toRefs(_model)

  return {
    _pageNum,
    _pageSize,
    _handleCurrentChange,
    _handleSizeChange,
    _listLoading,
    _getList,
    _dataList,
    _uniKey,
    _total,
    _isVisible,
    _model:form,
    _actionType,
    _handleAdd,
    _handleSave,
    _handleClose,
    _handleEdit
  }
}



// 列表
function __getList(url, data) {
  return request({
    url: url,
    data,
    method: 'get',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: true,
    isNeedUpdateToken: false
  })
}


//获取详情
function __getDetail(url, id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
    bfLoading: true,
    isParams: false,
    isAlertErrorMsg: true,
    isNeedUpdateToken: false
  })
}


