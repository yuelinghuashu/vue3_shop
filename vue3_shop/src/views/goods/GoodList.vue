<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input clearable @clear="getGoodList" v-model="queryInfo.data.query" placeholder="请输入内容" class="input-with-select">
                    <template #append>
                        <el-button @click="getGoodList" :icon="Search" />
                    </template>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button @click="goAddPage" type="primary">添加商品</el-button>
            </el-col>
        </el-row>


        <el-table :data="goodList.data.goods" style="width: 100%" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="400px" />
            <el-table-column prop="goods_price" label="商品价格（元）" />
            <el-table-column prop="goods_number" label="商品数量" />
            <el-table-column prop="goods_weight" label="商品重量（千克）" />
            <el-table-column prop="upd_time" label="创建时间" />
            <el-table-column prop="goodList" label="操作" width="110px">
                <template v-slot="scope">
                    <el-button @click="removeGoods(scope.row.goods_id)" type="danger">
                        <el-icon :size="15">
                            <DeleteFilled />
                        </el-icon>
                        &nbsp;删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="queryInfo.data.pagenum" v-model:page-size="queryInfo.data.pagesize"
            :page-sizes="[5, 10, 20]" :small="false" :disabled="false" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, DeleteFilled, Search } from '@element-plus/icons-vue'

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

onMounted(() => {
    getGoodList()
})

// 获取用户列表的参数对象
const queryInfo = reactive({
    data: {
        query: '',
        pagenum: 1,
        pagesize: 5
    }
})
const total = ref(0)
const goodList = reactive({
    data: []
})

// 获取商品列表数据
async function getGoodList() {
    const { data: res } = await $axios.get('goods', { params: queryInfo.data })
    goodList.data = res.data
    total.value = res.data.total
    console.log(goodList.data)
    console.log(total.value)
}

// 当前页码改变的时候
function handleCurrentChange(newPage) {
    queryInfo.data.pagenum = newPage
    getGoodList()
}

// 当前每页显示多少条数据改变的时候
function handleSizeChange(newPage) {
    queryInfo.data.pagesize = newPage
    getGoodList()
}

// 删除某个商品数据
function removeGoods(id) {
    ElMessageBox.confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await $axios.delete(`goods/${id}`)
            getGoodList()
            ElMessage({
                type: 'success',
                message: '已删除',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
</script>