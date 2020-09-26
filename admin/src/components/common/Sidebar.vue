<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },

                {
                    icon: 'el-icon-lx-picfill',
                    index: '1',
                    title: '图片管理',
                    subs: [
                        {
                            icon: 'el-icon-lx-roundadd',
                            index: '/images',
                            title: '添加图片'
                        },
                        {
                            icon: 'el-icon-lx-cascades',
                            index: 'imagelist',
                            title: '图片列表'
                        }
                    ]
                },

                {
                    icon: 'el-icon-lx-tagfill',
                    index: '2',
                    title: '分类管理',
                    subs: [
                        {
                            icon: 'el-icon-lx-roundadd',
                            index: '/categories',
                            title: '添加分类'
                        },
                        {
                            icon: 'el-icon-lx-cascades',
                            index: 'categorylist',
                            title: '分类列表'
                        }
                    ]
                },

                {
                    icon: 'el-icon-lx-read',
                    index: '3',
                    title: '文章管理',
                    subs: [
                        {
                            icon: 'el-icon-lx-roundaddfill',
                            index: 'articles',
                            title: '添加文章'
                        },
                        {
                            icon: 'el-icon-lx-copy',
                            index: 'articlelist',
                            title: '文章列表'
                        }
                    ]
                },

                {
                    icon: 'el-icon-lx-link',
                    index: '4',
                    title: '友链管理',
                    subs: [
                        {
                            icon: 'el-icon-circle-plus',
                            index: 'link',
                            title: '添加友链'
                        },

                        {
                            icon: 'el-icon-share',
                            index: 'linklist',
                            title: '友链列表'
                        }
                    ]
                },

                {
                    icon: 'el-icon-lx-apps',
                    index: '5',
                    title: '项目管理',
                    subs: [
                        {
                            icon: 'el-icon-circle-plus-outline',
                            index: 'project',
                            title: '添加项目'
                        },
                        {
                            icon: 'el-icon-s-opportunity',
                            index: 'projectlist',
                            title: '项目列表'
                        }
                    ]
                },

                {
                    icon: 'el-icon-lx-peoplefill',
                    index: '6',
                    title: '账号管理',
                    subs: [
                        {
                            icon: 'el-icon-plus',
                            index: 'adduser',
                            title: '添加管理员'
                        },

                        {
                            icon: 'el-icon-user-solid',
                            index: 'adminlist',
                            title: '管理员列表'
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
