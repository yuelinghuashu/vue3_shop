<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col :span="8">
                <el-input @clear="getOrdersList" clearable v-model="queryInfo.data.query" placeholder="请输入内容">
                    <template #append>
                        <el-button @click="getOrdersList" :icon="Search" />
                    </template>
                </el-input>
            </el-col>
        </el-row>

        <el-table :data="ordersList.data" border stripe style="width: 100%">
            <el-table-column prop="order_number" label="订单编号" />
            <el-table-column prop="order_price" label="订单价格" />
            <el-table-column prop="pay_status" label="是否付款" />
            <el-table-column prop="is_send" label="是否发货" />
            <el-table-column prop="create_time" label="下单时间" />
            <el-table-column prop="name" label="操作" width="200px">
                <template v-slot="scope" #append>
                    <el-button type="primary" :icon="Edit">编辑</el-button>
                    <el-button type="danger" :icon="DeleteFilled">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="queryInfo.data.pagenum" v-model:page-size="queryInfo.data.pagesize" :page-sizes="[5, 10, 15, 20]"
            :small="false" :disabled="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
</template>

<script setup lang="ts">

import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Search, Edit, DeleteFilled } from '@element-plus/icons-vue'

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

onMounted(() => {
    getOrdersList()
})

const queryInfo = reactive({
    data: {
        query: '',
        pagenum: 1,
        pagesize: 5
    }
})
const total = ref(0)
const ordersList = reactive({
    data: []
})

async function getOrdersList() {
    const { data: res } = await $axios.get('orders', { params: queryInfo.data })
    ordersList.data = res.data.goods
    total.value = res.data.total
    console.log(res.data)
}

function handleSizeChange(newPage){
    queryInfo.data.pagesize = newPage
    getOrdersList()
}

function handleCurrentChange(newPage){
    queryInfo.data.pagenum = newPage
    getOrdersList()
}

</script>

<style scoped></style>