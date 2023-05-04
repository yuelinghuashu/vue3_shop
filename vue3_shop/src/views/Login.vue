<template>
    <div class="login_box">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="60px" class="demo-ruleForm">
            <h2>后台管理系统</h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'


const ruleFormRef = ref<FormInstance>()

interface loginInfo {
    username: string
    password: string
}

const ruleForm = reactive<loginInfo>({
    username: 'admin',
    password: '123456'
})
const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入你的账号', trigger: 'blur' },
        { min: 5, max: 15, message: '长度必须在5-15之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入你的密码', trigger: 'blur' },
        { min: 5, max: 15, message: '长度必须在5-15之间', trigger: 'blur' },
    ]
})

const currentInstance = getCurrentInstance()
const { $axios } = currentInstance.appContext.config.globalProperties

// 登录
const router = useRouter()
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async valid => {
        if (valid) {
            const { data: res } = await $axios.post('login', ruleForm)
            console.log(res)
            // 1. 将登陆成功之后的token，保存到客户端的sessionStorage中
            //     1.1 项目中除了登录以外的其他API接口，必须在登录之后才能访问
            //     1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            sessionStorage.setItem('token', res.data.token)
            // 2. 通过编程式导航跳转到后台主页，路由地址是/home
            router.push('/home')
        } else {
            console.log('error submit!')
            return false
        }
    })
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>
  
<style lang="less" scoped>
.login_box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #00c5aa;
}

.el-form {
    width: 500px;
    background-color: #fff;
    padding: 40px;
    border-radius: 5px;
    padding-top: 25px;
    padding-bottom: 30px;

    h2 {
        text-align: center;
        margin-bottom: 10px;

    }
}

.el-button {
    width: 48%;
}
</style>