/*
 * @Author       : xh
 * @Date         : 2022-05-12 20:46:27
 * @LastEditors  : xh
 * @LastEditTime : 2022-05-13 11:00:04
 * @FilePath     : \vue3-admin-template\src\hooks\useBase.js
 */

import request from '@/utils/axiosReq'

export default function (setting) {
  const { bf_searchParams = null, baseUrl = '', key = '' ,defaultModal={}} = setting
  const serveUrl = ref('')
  const uniKey = ref('id')
  const dialogVisible = ref(true)
  /*分页*/
  const pageNum = ref(1)
  const pageSize = ref(2)
  const total = ref(0)
  const dataList = ref([])


  const model = reactive({
    ...defaultModal
  })
  
  // 多选

  const listLoading = ref(false)

  onMounted(() => {
    serveUrl.value = baseUrl
    uniKey.value = key

  })




  // 通用部分
  const handleCurrentChange = (val) => {
    // debugger
    pageNum.value = val
    getList()
  }
  const handleSizeChange = (val) => {
    pageSize.value = val
    getList()
  }




  // 列表
  const getList = async (val) => {
    try {
      let data = {
        pageNum: pageNum.value, pageSize: pageSize.value,

      }
      data = searchParams(data)
      const res = await __getList(serveUrl.value, { ...data })
      //  console.log('res',res)
      dataList.value = res.list
      total.value = res.total
    } catch (error) { }
  }



  // 预制搜索参数构造
  const searchParams = (data) => {
    if (bf_searchParams && typeof bf_searchParams === 'function') {
      return bf_searchParams(data)
    } else {
      return { ...data }
    }
  }



  watch([pageNum, pageSize], (newValue, oldValue) => {
    getList()
  })



  return {
    pageNum,
    pageSize,
    handleCurrentChange,
    handleSizeChange,
    listLoading,
    getList,
    dataList,
    uniKey,
    total,
    dialogVisible,
    model
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
    isAlertErrorMsg: false,
    isNeedUpdateToken: true
  })
}
