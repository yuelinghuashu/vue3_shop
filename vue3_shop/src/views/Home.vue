<template>
    <el-container class="home_container">

        <el-header>
            <div>
                <router-link to="/home">
                    <img src="../assets/saber.jfif" alt="">
                </router-link>
                <span>后台管理系统</span>
            </div>
            <el-button @click="loginOut" type="info">退出</el-button>
        </el-header>

        <el-container>
            <el-aside :width="isCollapse.is_collapse ? '60px' : '200px'">
                <!-- 折叠和展开 -->
                <div v-show="isCollapse.is_collapse === true" class="toggle-button" @click="toggleCollapse">展开 &gt;&gt;
                </div>
                <div v-show="isCollapse.is_collapse === false" class="toggle-button" @click="toggleCollapse">&lt;&lt; 折叠
                </div>

                <!-- 侧边栏菜单区域 -->
                <el-menu active-text-color="#ffd04b" background-color="#333744" default-active="2" text-color="#fff"
                    unique-opened :collapse-transition="false" :collapse="isCollapse.is_collapse" router>
                    <!-- 一级菜单 -->
                    <el-sub-menu :index="item1.id + ''" v-for="(item1, index) in menu_list.info" :key="item1.id">
                        <template #title>
                            <el-icon>
                                <component :is="menu_list.icon[index]" />
                            </el-icon>
                            <span>{{ item1.authName }}</span>
                        </template>
                        <el-menu-item :index="'/' + item2.path" v-for="item2 in item1.children" :key="item2.id" @click="saveNavState('/' + item2.path)">
                            <template #title>
                                <el-icon>
                                    <Menu style="width: 1.4em; height: 1.4em; margin-right: 8px" color="#909399" />
                                </el-icon>
                                <span>{{ item2.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>

            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance, onMounted } from 'vue'
import { User, Operation, ShoppingBag, Tickets, DataLine, Menu } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

onMounted(() => {
    getMenuList()
    activePath_list.activePath = sessionStorage.getItem('activePath')
})

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

const router = useRouter()

// 左侧菜单数据
const menu_list = reactive({
    info: {},
    icon: [
        User,
        Operation,
        ShoppingBag,
        Tickets,
        DataLine
    ]
})

// 是否折叠
const isCollapse = reactive({
    is_collapse: false
})

// 被激活的链接地址列表
const activePath_list = reactive({
    activePath: {}
})

// 退出事件
// 退出功能实现原理
// 基于token的方式实现退出比较简单，只需要销毁本地的token即可。这样后续的请求就不会携带token，必须重新生成一个新的token之后才可以访问页面
function loginOut() {
    // 清除token
    sessionStorage.removeItem('token')
    // 跳转到登录页
    router.push('/login')
}

// 获取菜单列表
async function getMenuList() {
    const { data: res } = await $axios.get('menus')
    menu_list.info = res.data
    console.log(menu_list.info)
}

// 点击按钮，切换菜单的折叠与展开
function toggleCollapse() {
    isCollapse.is_collapse = !isCollapse.is_collapse
}

// 保存链接的激活状态
function saveNavState(activePath){
    // console.log(activePath)
    sessionStorage.setItem('activePath', activePath)
    activePath_list.activePath = activePath
}

</script>

<style lang="less" scoped>
.home_container {
    width: 100%;
    height: 100%;
}

.el-header {
    background-color: #373d41;
    color: #fff;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;

    div {
        display: flex;
        align-items: center;

        img {
            width: 60px;
            border-radius: 50%;
        }

        span {
            margin-left: 15px;
        }
    }

}

.el-aside {
    background-color: #333744;
    color: #fff;

    .el-menu {
        border-right: none;

        span {
            margin-left: 15px;
        }
    }

}

.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    line-height: 25px;
    text-align: center;
    font-size: 14px;
    letter-spacing: 0.2em;
    cursor: pointer;
    background-color: #4a5064;
}
</style>