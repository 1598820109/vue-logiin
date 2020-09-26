import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/images',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/BaseImage.vue'),
                    meta: { title: '添加图片' }
                },

                {
                    path: '/imagelist',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseImageList.vue'),
                    meta: { title: '图片列表' }
                },
                {
                    path: '/categories',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/BaseCategory.vue'),
                    meta: { title: '添加分类' }
                },

                {
                    path: '/categorylist',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseCategoryList.vue'),
                    meta: { title: '分类列表' }
                },

                {
                    path: '/articles',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseArticle.vue'),
                    meta: { title: '添加文章' }
                },

                {
                    path: '/articles/edit/:id',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseArticle.vue'),
                    props: true,
                    meta: { title: '修改文章' }
                },
                {
                    path: '/articlelist',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/BaseArticleList.vue'),
                    meta: { title: '文章列表' }
                },

                {
                    path: '/link',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/BaseLink.vue'),
                    meta: { title: '添加友链' }
                },

                {
                    path: '/linklist',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/BaseLinklist.vue'),
                    meta: { title: '友链列表' }
                },

                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },

                {
                    path: '/myself',
                    component: () => import(/* webpackChunkName: "Basemyself" */ '../components/page/Basemyself.vue'),
                    meta: { title: '个人主页' }
                },

                {
                    path: '/project',
                    component: () => import(/* webpackChunkName: "BaseList" */'../components/page/BaseProject.vue'),
                    meta: { title: '添加项目' }
                },
                {
                    path: '/projectlist',
                    component: () => import(/* webpackChunkName: "BaseList" */'../components/page/BaseProjectlist.vue'),
                    meta: { title: '项目列表' }
                },

                {
                    path: '/adduser',
                    component: () => import(/* webpackChunkName: "BaseList" */'../components/page/BaseUser.vue'),
                    meta: { title: '添加管理员' }

                },
                {
                    path: '/adminlist',
                    component: () => import(/* webpackChunkName: "BaseList" */'../components/page/BaseUserList.vue'),
                    meta: { title: '管理员列表' }

                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录', isPublic: true }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
    if (!to.meta.isPublic && !localStorage.token) {
        return next('/login')
    }
    next();
})

export default router;