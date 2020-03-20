<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form :model="model" status-icon :rules="rules" ref="model" label-width="100px" class="demo-model">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model.number="model.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="model.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="model.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="邮箱" prop="email">
                        <el-input type="email" v-model="model.email" autocomplete="off"></el-input>
                    </el-form-item>

                     <el-form-item label="电话号码" prop="telephone">
                        <el-input type="number" v-model="model.telephone" autocomplete="off"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="管理员">
                        <el-switch v-model="model.delivery"></el-switch>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('model')">提交</el-button>
                        <el-button @click="resetForm('model')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        inject: ['reload'],
        data() {
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                callback();
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(value.length >12 || value.length < 6){
                    callback(new Error('密码长度6 ~ 12 之间'));
                } else {
                    if (this.model.checkPass !== '') {
                        this.$refs.model.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.model.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            var email = (rule, value, callback) => {
                var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

                if (!value) {
                    return callback(new Error('邮箱不能为空'));
                }else if(reg.test(value)){
                    callback();
                }else{
                    return callback(new Error('邮箱格式错误'))
                }
            };

            var telephone = (rule, value, callback) => {
                var PhoneNumber = /^1(3|4|5|6|7|8|9)\d{9}$/;
                if (!value) {
                    return callback(new Error('请输入电话号码'));
                }else if(!PhoneNumber.test(value)){
                    return callback (new Error('电话号码格式不正确'));
                }else{
                    callback();
                }
            };


            return {
                model: {
                    password: '',
                    checkPass: '',
                    username: '',
                    email:'',
                    telephone:'',
                    delivery:false
                },
                rules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    username: [
                        { validator: checkAge, trigger: 'blur' }
                    ],
                    email:[
                        { validator: email, trigger: 'blur' }
                    ],
                    telephone:[
                        { validator: telephone, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            async submitForm(formName) {
                console.log(formName)
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await this.$http.post('rest/login',this.model);
                        this.reload();
                        this.$router.push('/adminlist');
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        width: 178px;
        height: 178px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>