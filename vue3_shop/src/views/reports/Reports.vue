<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
</template>

<script setup lang="ts">

import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Search, Edit, DeleteFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import _ from 'lodash'

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties


onMounted(async () => {
    // 此时，页面上的元素已经被渲染完毕了
    // 2. 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));

    const { data:res } = await $axios.get('reports/type/1')

    // 3. 指定图表的配置项和数据
    const result = _.merge(res.data, options.data)

    // 4. 使用刚指定的配置项和数据显示图表。

    myChart.setOption(result);
})

const options = reactive({
    // 需要合并的数据
    data: {
        title: {
            text: '用户来源'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#E9EEF3'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                boundaryGap: false
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ]
    }
})



</script>

<style scoped></style>