<template>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

        <!-- 搜索与添加区域 -->
        <!-- :gutter: 间距    :span:占据的宽度 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="mt-4">
                    <el-input clearable @clear="getUserList" v-model="data.queryInfo.query" placeholder="请输入内容"
                        class="input-with-select">
                        <template #append>
                            <el-button @click="getUserList" :icon="Search" />
                        </template>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 用户与列表区 -->
        <el-table :data="data.userList" stripe border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="role_name" label="角色" />

            <el-table-column prop="mg_state" label="状态">
                <template v-slot="scope">
                    <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state" />
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200px">
                <template v-slot="scope">
                    <!-- el-tooltip组件 文字信息提示 -->
                    <el-tooltip class="box-item" effect="dark" content="修改用户" placement="top">
                        <el-button @click="showEditDialog(scope.row.id)" size="default" type="primary">
                            <el-icon :size="15">
                                <Edit />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" content="删除用户" placement="top">
                        <el-button @click="removeUserById(scope.row.id)" size="default" type="danger">
                            <el-icon :size="15">
                                <DeleteFilled />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top">
                        <el-button @click="showRole(scope.row)" size="default" type="warning">
                            <el-icon :size="15">
                                <Setting />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>

            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="data.queryInfo.pagenum" v-model:page-size="data.queryInfo.pagesize"
                :page-sizes="[3, 5, 10]" :small="data.small" :disabled="data.disabled" :background="data.background"
                layout="total, sizes, prev, pager, next, jumper" :total="data.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 添加用户的对话框 -->
        <el-dialog v-model="addDialogVisible" title="添加用户" width="50%">

            <el-form ref="addRuleFormRef" :model="addRuleForm" status-icon :rules="addRules" label-width="80px">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="addRuleForm.username" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addRuleForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addRuleForm.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addRuleForm.mobile" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addResetForm(addRuleFormRef)">取消</el-button>
                    <el-button type="primary" @click="addSubmitForm(addRuleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑用户" width="50%">

            <el-form ref="editRuleFormRef" :model="editRuleForm.data" status-icon :rules="editRules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="editRuleForm.data.username" type="text" autocomplete="off" disabled />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model.number="editRuleForm.data.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model.number="editRuleForm.data.mobile" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editResetForm(editRuleFormRef)">取消</el-button>
                    <el-button type="primary" @click="editSubmitForm(editRuleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog @close="setRoleDialogClose" v-model="setRoleDialogVisible" title="分配角色" width="50%">

            <div>
                <p>当前的用户：{{ userInfo.data.username }}</p>
                <p>当前的角色：{{ userInfo.data.role_name }}</p>
                <p>
                    分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择" size="large">
                        <el-option v-for="item in rolesList.data" :key="item.id" :label="item.roleName" :value="item.id" />
                    </el-select>
                </p>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">

import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Search, Edit, DeleteFilled, Setting } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'


const data = reactive({
    // 获取用户列表的参数对象
    queryInfo: {
        // 查询参数
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
    },
    // 用户数据列表
    userList: [],
    total: 0,
    small: false,
    background: false,
    disabled: false
})
// 控制添加用户的对话框的开关
const addDialogVisible = ref(false)
// 添加用户的数据对象
const addRuleForm = reactive({
    username: '',
    password: '',
    email: '',
    mobile: ''
})
// 添加用户的表单数据
const addRuleFormRef = ref<FormInstance>()
// 表单校验规则
const addRules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入你的名字', trigger: 'blur' },
        { min: 5, max: 15, message: '账号长度必须在5至15之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入你的密码', trigger: 'blur' },
        { min: 5, max: 15, message: '密码长度必须在5至15之间', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入你的邮箱', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '输入的邮箱格式不正确', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入你的手机号', trigger: 'blur' },
        { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '输入的手机号格式不正确', trigger: 'blur' }
    ],
})
// 控制编辑用户的对话框的开关
const editDialogVisible = ref(false)
// 查询到的用户信息对象
const editRuleForm = reactive({
    data: {}
})
// 编辑用户的表单数据
const editRuleFormRef = ref<FormInstance>()
// 编辑用户的数据校验规则
const editRules = reactive<FormRules>({
    email: [
        { required: true, message: '请输入你的邮箱', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '输入的邮箱格式不正确', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入你的手机号', trigger: 'blur' },
        { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '输入的手机号格式不正确', trigger: 'blur' }
    ],
})
// 控制分配角色的对话框的开关
const setRoleDialogVisible = ref(false)
// 需要被分配角色的用户信息
const userInfo = reactive({
    data: {}
})
// 所有角色数据列表
const rolesList = reactive({
    data: {}
})
// 已选中的id值
const selectRoleId = ref('')


onMounted(() => {
    getUserList()
})


const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

// 获取用户数据列表
async function getUserList() {
    const { data: res } = await $axios.get('users', { params: data.queryInfo })
    data.userList = res.data.users
    data.total = res.data.total
    console.log(data.userList, data.total)
}

// 监听pagesize改变的事件
function handleSizeChange(new_Value: number) {
    data.queryInfo.pagesize = new_Value
    getUserList()
}

// 监听页码值改变的事件
function handleCurrentChange(new_Value: number) {
    data.queryInfo.pagenum = new_Value
    getUserList()
}

// 监听switch开关状态的改变
async function userStateChange(userInfo) {
    const { data } = await $axios.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
    userInfo.mg_state = !userInfo.mg_state
}

// 关闭添加用户的对话框，并重置该表单项，将其值重置为初始值，并移除校验结果
function addResetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    addDialogVisible.value = false
}

// 关闭添加用户的对话框，并添加用户
function addSubmitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            $axios.post('users', addRuleForm)
            addDialogVisible.value = false
            getUserList()

        } else {
            console.log('输入有误!')
            return false
        }
    })
}

// 控制修改用户的对话框的开关
async function showEditDialog(id) {
    const { data: res } = await $axios.get(`users/${id}`)
    editRuleForm.data = res.data
    console.log(editRuleForm.data)
    editDialogVisible.value = true
}

// 关闭修改用户的对话框，并重置该表单项，将其值重置为初始值，并移除校验结果
function editResetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    editDialogVisible.value = false
}

// 关闭修改用户的对话框，并修改用户数据
function editSubmitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            // console.log('submit!')
            await $axios.put(`users/${editRuleForm.data.id}`, { email: editRuleForm.data.email, mobile: editRuleForm.data.mobile })
            editDialogVisible.value = false
            getUserList()

        } else {
            console.log('输入有误!')
            return false
        }
    })
}

// 根据id删除用户
function removeUserById(id) {
    ElMessageBox.confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await $axios.delete(`users/${id}`)
            ElMessage({
                type: 'success',
                message: '已删除该用户',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 显示分配角色的对话框
async function showRole(user_info) {
    userInfo.data = user_info
    console.log(userInfo.data)

    const { data: res } = await $axios.get('roles')
    rolesList.data = res.data
    console.log(rolesList.data)

    setRoleDialogVisible.value = true
}

// 点击按钮，分配角色
async function saveRoleInfo() {
    const { data: res } = await $axios.put(`users/${userInfo.data.id}/role`, { rid: selectRoleId.value })
    setRoleDialogVisible.value = false
    getUserList()
}

// 监听分配角色对话框的关闭事件
function setRoleDialogClose() {
    selectRoleId.value = ''
    userInfo.data = {}
}

</script>

<style lang="css" scoped>
.el-dialog div p {
    margin-bottom: 15px;
}
</style>