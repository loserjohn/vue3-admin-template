import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes,routeComponent } from '@/router'
import settings from '@/settings'
import Layout from '@/layout';



// 通过后台 配置生成的  菜单列表
export function filterAsyncRoutes(menus) {
  const res = [];
  menus.map((it) => {
    const metas = {};
    metas.id = it.id;
    metas.title = it.display_name;
    metas.icon = it.icon;
    const item = {
      path:it.name &&!it.name.startsWith('/')? `/${it.name}` :it.name,
      name: it.name,
      redirect: '',
      meta: metas,
      hidden: it.status == 0 || it.is_menu ==  0
    };
    item.component = Layout;

    if(it.status==1){
      if (  it.subs && it.subs.length > 0) {
        // 多级则递归子级
        item.children = filterSon(it.subs);
        res.push(item);
      } else if (  routeComponent[it.name]) {
        //单级
        item.path = routeComponent[it.name].path;   
        item.children = [{
          ...item,
          component: routeComponent[it.name].component
        }];
        res.push(item);
      }

    }
    


  });
  return res;
}
export function filterSon(menus) {
  const res = [];
  menus.map((it) => {
    const metas = {};
    metas.id = it.id;
    metas.title = it.display_name;
    metas.icon = it.icon;
    const item = {
      // path: it.page_url,
      name: it.name,
      redirect: '',
      // meta: metas,
      hidden: it.status == 0 || it.is_menu == 0
    };
    if ( it.status ==1 && routeComponent[it.name]) {
      // debugger
      const { path } = routeComponent[it.name];
      // debugger
      // const urls = path.split('?');
      // if (urls.length > 1 && urls[1].length > 0) {
      //   const params_items = urls[1].split('&');
      //   for (let i = 0; i < params_items.length; i++) {
      //     const items = params_items[i].split('=');
      //     metas[items[0]] = items[1];
      //   }
      // }

      // item.component = () => Promise.resolve(require(`@/views${it.page_url.split('/:')[0]}`).default)
      item.component = routeComponent[it.name].component;
      item.path = path;
      item.meta = metas;
      if (it.subs && it.subs.length > 0) {
        item.children = filterSon(it.subs);
      }
      res.push(item);
    } 
    // else {
    //   item.path = it.name;
    //   item.meta = metas;
    //   item.component = () => import('@/views/error-page/404');
    // }
    

    
  });
  return res;
}

export const usePermissionStore = defineStore('permission', {
  /***
   *类似于组件的 data数据的 ,用来存储全局状态的
   * 1、必须是箭头函数
   */
  state: () => {
    return {
      isGetUserInfo: false, // get userInfo
      routes: [], //将过滤后的异步路由和静态路由集合
      addRoutes: [] //过滤后的异步路由
    }
  },

  /***
   *封装处理数据的函数（业务逻辑)：修改数据
   */
  actions: {
    M_routes(routes) {
      this.$patch((state) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
      })
    },
    M_isGetUserInfo(data) {
      this.$patch((state) => {
        state.isGetUserInfo = data
      })
    },
    generateRoutes(menus) {
      return new Promise(async (resolve) => {
        // let accessedRoutes
        // if (settings.permissionMode === 'roles') {
        //   //filter by role
        //   if (roles.includes('admin')) {
        //     accessedRoutes = asyncRoutes || []
        //   } else {
        //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        //   }
        // } else {
        //   //filter by codeArr
        //   //req code arr
         

        //   let codeArr = localStorage.getItem('codeArr')
        //   if (codeArr) {
        //     codeArr = JSON.parse(codeArr)
        //   } else {
        //     localStorage.setItem('codeArr', JSON.stringify([1]))
        //     codeArr = localStorage.getItem('codeArr')
        //   }
        //   accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes)
        // }

        //后台配置的 菜单返回   动态配置 菜单名字   
        console.log('menus', menus);
        const accessedRoutes = await filterAsyncRoutes(menus);
  
        accessedRoutes.push({ path: '/*', redirect: '/404', hidden: true });
        console.log('accessedRoutes', accessedRoutes);
        // commit('M_routes', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})



/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param routeItem
 */
 function hasCodePermission(codeArr, routeItem) {
  if (routeItem.meta && routeItem.meta.code) {
    return codeArr.includes(routeItem.meta.code) || routeItem.hidden
  } else {
    return true
  }
}
/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param asyncRoutes
 */
function filterRouterByCodeArr(codeArr, asyncRoutes) {
  return new Promise((resolve) => {
    const filterRouter = []
    asyncRoutes.forEach(async (routeItem) => {
      if (hasCodePermission(codeArr, routeItem)) {
        if (routeItem.children) {
          routeItem.children = await filterRouterByCodeArr(codeArr, routeItem.children)
        }
        filterRouter.push(routeItem)
      }
    })
    resolve(filterRouter)
  })
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta?.roles?.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//   routes.forEach((route) => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }