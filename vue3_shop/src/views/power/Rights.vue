<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-table :data="rightList.data" style="width: 100%" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称" />
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="level" label="权限等级">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag v-if="scope.row.level === '1'" class="ml-2" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.level === '2'" class="ml-2" type="info">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">

import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue'

onMounted(() => {
    getRightList()
})

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

const rightList = reactive({
    data: []
})

async function getRightList() {
    const { data: res } = await $axios.get(`rights/list`)
    rightList.data = res.data
    console.log(rightList.data)
}

</script>

<style scoped></style>