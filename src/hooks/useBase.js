
import request from '@/utils/axiosReq'
export default function (selectPageReq) {

  const serveUrl = ref('')
  const uniKey = ref('')

  /*分页*/
  const pageNum = ref(1)
  const pageSize = ref(10)
  
  const dataList = ref([])

  // 多选

  const listLoading =  ref(false)


  
  const init = (setting={})=>{
    const {baseUrl='',key=''} = setting
    serveUrl.value = baseUrl
    uniKey.value = key
  }
  

  const handleCurrentChange = (val) => {
    pageNum.value = val
    selectPageReq()
  }
  const handleSizeChange = (val) => {
    pageSize.value = val
    selectPageReq()
  }

  const getList = async (val) => {
     try {
       const res =  await __getList( serveUrl.value ,{})
       console.log('res',res)
     } catch (error) {
       debugger
     }
  }

  onMounted(() => {})
  return {
    pageNum,
    pageSize,
    handleCurrentChange,
    handleSizeChange,
    listLoading,
    init,
    getList,
    dataList
  }
}


function  __getList(url,data) {
  return request({
    url: url,
    params:data,
    method: 'get',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false,
    isNeedUpdateToken:true
  })
}
