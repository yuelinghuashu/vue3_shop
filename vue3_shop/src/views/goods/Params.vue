<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <el-alert title="注意：只允许第三级分类设置相关参数！" type="warning" show-icon />

        <!-- 选择商品分类区域 -->
        <div class="cat_option">
            <span>选择商品分类：</span>
            <el-cascader v-model="selectedCateKeys.data" :options="CateList.data" :props="prop.data"
                @change="handleChange" />
        </div>
    </el-card>

    <!-- tab页签区域 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
            <el-button :disabled="isBtnDisabled" type="primary">添加参数</el-button>
            <el-table :data="manyTableData.data" style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template #default="props">

                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称" />
                <el-table-column prop="address" label="操作">
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

        </el-tab-pane>
        
        <el-tab-pane label="静态属性" name="only">
            <el-button :disabled="isBtnDisabled" type="primary">添加静态</el-button>
            <el-table :data="onlyTableData.data" style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template #default="props">

                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称" />
                <el-table-column prop="address" label="操作">
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
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance, onMounted, computed } from 'vue';
import { ArrowRight, Edit, DeleteFilled } from '@element-plus/icons-vue'

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

onMounted(() => {
    getCateList()
})

// 商品分类列表
const CateList = reactive({
    data: []
})
// 级联选择器的配置对象
const prop = reactive({
    data: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
    }
})
// 级联选择框双向绑定到的数组
const selectedCateKeys = reactive({
    data: []
})
// 被激活的页签名称
const activeName = ref('many')
// 动态参数的数据
const manyTableData = reactive({
    data: []
})
// 静态参数的数据
const onlyTableData = reactive({
    data: []
})



// 获取商品分类数据
async function getCateList() {
    const { data: res } = await $axios.get(`categories`)
    CateList.data = res.data
    console.log(CateList.data)

}

// 级联选择框选中项变化，会触发这个函数
function handleChange() {
    getParamsData()
}

// tab页签点击事件的处理函数
function handleClick() {
    console.log(activeName)
    getParamsData()
}

// 获取参数的数据列表
async function getParamsData() {
    // 证明选中的不是三级分类
    if (selectedCateKeys.data.length !== 3) {
        selectedCateKeys.data = []
        manyTableData.data = []
        onlyTableData.data = []
        return
    }
    // 证明选中的是三级分类
    console.log(selectedCateKeys.data[2])

    // 根据所选分类的id和当前所处的面板获取对应的参数
    const { data: res } = await $axios.get(`categories/${selectedCateKeys.data[2]}/attributes`, { params: { sel: activeName.value } })
    console.log(res)

    if (activeName.value === 'many') {
        manyTableData.data = res.data
    } else {
        onlyTableData.data = res.data
    }
}


// 如果按钮需要被禁用，则返回true，否则返回false
const isBtnDisabled = computed(() => {
    if (selectedCateKeys.data.length !== 3) return true
    return false
})

// 当前选中的三级分类的id
const cateId = computed(() => {
    if (selectedCateKeys.data.length === 3) {
        return selectedCateKeys.data[2]
    }
    return null
})

// 动态计算标题的文本
const titleText = computed(() => {
    if (activeName.value === 'many') {
        return '动态参数'
    } else {
        return '静态参数'
    }
})


</script>

<style lang="css" scoped>
.cat_option {
    margin: 15px 0;
}
</style>