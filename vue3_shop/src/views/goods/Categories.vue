<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

        <el-table :data="cateList.data" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border
            stripe style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="cat_name" label="分类名称" />
            <el-table-column prop="cat_deleted" label="是否有效">
                <template v-slot="scope">
                    <el-icon :size="15">
                        <SuccessFilled style="color: green;" v-if="scope.row.cat_deleted === false" />
                        <CircleCloseFilled style="color: red;" v-else />
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序" />
            <el-table-column prop="" label="操作">
                <template v-slot="scope">
                    <el-button type="primary">
                        <el-icon :size="15">
                            <Edit />
                        </el-icon>
                        &nbsp;编辑
                    </el-button>
                    <el-button type="danger">
                        <el-icon :size="15">
                            <DeleteFilled />
                        </el-icon>
                        &nbsp;删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script lang="ts" setup>

import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, DeleteFilled, Edit, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

onMounted(() => {
    getCategoriesList()
})

// 查询条件
const queryInfo = reactive({
    data: {
        type: 3,
        pagenum: 1,
        pagesize: 5
    }
})
// 商品分类的数据列表，默认为空
const cateList = reactive({
    data: []
})
// 总数据条数
const total = ref(null)

async function getCategoriesList() {
    const { data: res } = await $axios.get(`categories`, { params: queryInfo.data })
    cateList.data = res.data.result
    total.value = res.total
    console.log(cateList.data)
}

</script>

<style lang="scss" scoped></style>