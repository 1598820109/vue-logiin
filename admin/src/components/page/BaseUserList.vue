<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理员列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="管理员" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="_id" label="ID" width="230" align="center"></el-table-column>
                <el-table-column prop="username" align="center" label="用户名称"></el-table-column>
                <el-table-column prop="email" align="center" label="邮箱" width="220"></el-table-column>
                <el-table-column prop="telephone" align="center" label="联系电话" width="180"></el-table-column>
                <el-table-column prop="delivery" align="center" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.delivery" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="date" align="center" label="注册时间" width="200"></el-table-column>
                <el-table-column label="操作" width="230" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-lock"
                            @click="handleEditPassword(scope.$index, scope.row)"
                        >密码</el-button>

                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="handleEdit(scope.$index, scope.row)"
                        >权限</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form :model="model" status-icon :rules="rules" ref="model" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="model.username"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input clearable v-model="model.email" ></el-input>
                </el-form-item>

                <el-form-item label="电话号码" prop="telephone">
                    <el-input clearable v-model="model.telephone" ></el-input>
                </el-form-item>

                <el-form-item label="管理员">
                    <el-switch v-model="model.delivery"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;getreload()">取 消</el-button>
                <el-button type="primary" @click="saveEdit('model')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->

        <!-- 修改密码弹出框 -->
        <el-dialog title="密码" :visible.sync="editPassword" width="50%">
           <el-steps :active="active" finish-status="success">
                <el-step title="输入新密码"></el-step>
                <el-step title="再次输入密码"></el-step>
                <el-step title="修改完成"></el-step>
            </el-steps>

            <el-form :model="model" status-icon :rules="rules" ref="model"  label-position="top" label-width="100px">
                <el-form-item v-if="active === 0" label="新密码" prop="password">
                    <el-input type="text" v-model="model.password"></el-input>
                </el-form-item>

                <el-form-item v-else-if="active === 1"  label="重复密码" prop="checkPassword">
                    <el-input type="text" v-model="model.checkPassword"></el-input>
                </el-form-item>

                <el-button style="margin-top: 12px;" @click="next('model')" v-show="showActive">{{active!=2?'下一步':'确认修改'}}</el-button>
            </el-form>
        </el-dialog>
        <!-- 修改密码弹出框 -->

    </div>
</template>

<script>
export default {
    name: 'basetable',
    inject: ['reload'],
    data(){

        var password = (rule, value, callback) => {
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

        var checkPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.model.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
        };
        
        var username = (rule,value,callback) =>{
            if(value === ''){
                callback(new Error('用户名不能为空'))
            }
            callback;
        }

        var email = (rule, value, callback) => {
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

            if (!value) {
                return callback(new Error('邮箱不能为空'));
            } else if (reg.test(value)) {
                callback();
            } else {
                return callback(new Error('邮箱格式错误'));
            }
        };

        var telephone = (rule, value, callback) => {
            var PhoneNumber = /^1(3|4|5|6|7|8|9)\d{9}$/;
            if (!value) {
                return callback(new Error('请输入电话号码'));
            } else if (!PhoneNumber.test(value)) {
                return callback(new Error('电话号码格式不正确'));
            } else {
                callback();
            }
        };
        return {
               model: {
                    password: '',
                    checkPassword:'',
                    username: '',
                    email:'',
                    telephone:'',
                    delivery:false
                },
                rules: {
                    username:[
                        {validator:username, trigger: 'blur'}
                    ],

                    password:[
                        {validator:password, trigger: 'blur'}
                    ],

                    checkPassword:[
                        {validator:checkPassword, trigger:'blur'}
                    ],

                    email:[
                        { validator: email, trigger: 'blur' }
                    ],
                    telephone:[
                        { validator: telephone, trigger: 'blur' }
                    ]
                },

            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editPassword:false,
            editVisible: false,
            showActive:true,
            active:0,
            pageTotal: 0,
            idx: -1,
            id: -1,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        async getData() {
            const res = await this.$http.get('rest/logins');
            this.tableData = res.data;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        async handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(`此操作将永久删除该文件, 是否继续 ? "${row.username}"`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    const res = await this.$http.delete(`rest/logins/${row._id}`);
                    //刷新数据
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
        },
        async delAllSelection(row) {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                console.log(this.multipleSelection[i]);
                str += this.multipleSelection[i].username + ' ';
            }

            this.$confirm(`是否永久删除该链接? "${str}"`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    for (let i = 0; i < length; i++) {
                        const res = await this.$http.delete(`rest/logins/${this.multipleSelection[i]._id}`);
                    }
                    //刷新数据
                    this.getData();
                    this.multipleSelection = [];
                    this.$message.error(`删除了${str}`);
                })
                .catch(() => {});
        },
        // 编辑操作
        async handleEdit(index, row) {
                this.idx = index;
                this.model = row;
                this.editVisible = true;
                console.log(this.model._id);
                const res = await this.$http.get(`rest/logins/${this.model._id}`);
        },
        // 保存编辑
        async saveEdit(row) {
            console.log(row)
            this.$refs[row].validate(async (valid) => {
                if (valid) {
                    console.log(valid);
                    this.editVisible = false;
                    const res = await this.$http.put(`rest/logins/${this.model._id}`, this.model);
                    this.getData();
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.$set(this.tableData, this.idx, this.model);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 修改密码
        async handleEditPassword(index,row){
            this.idx = index;
            // model绑定row
            this.model = row;
            this.editPassword = true;
            console.log(row)
            // 请求接口
            const res = await this.$http.get(`rest/logins/${this.model._id}`)
        },

        async next(row) {
            this.$refs[row].validate(async (valid)=>{
                if(valid){
                    this.active++;
                    if(this.active == 2){
                        this.$confirm('确认修改密码', '确认信息', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '保存',
                            cancelButtonText: '放弃修改'
                            })
                            .then(async() => {
                                this.active++;
                                // 关闭下一步按钮
                                this.showActive = false;
                                // 关闭弹窗
                                this.editPassword = false;
                                // 刷新
                                this.reload();   
                                // 请求服务器 更新密码
                                const res = await this.$http.put(`rest/logins/${this.model._id}`,this.model.password);
                                // 刷新列表数据
                                this.getData();
                                // 成功弹窗
                                this.$message({
                                type: 'success',
                                     message: '修改成功'
                                });
                            })
                            .catch(active => {
                                this.active = 1;
                                this.$message({
                                type: 'info',
                                message: active === 'cancel'
                                    ? '放弃保存并离开页面'
                                    : '停留在当前页面'
                                })
                        });
                    }
             
                }else{
                    console.log('error submit!!')
                    return false;
                }
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },

        // 取消编辑
        getreload() {
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.el-upload {
    width: 100px;
    height: 100px;
    padding: 13px;
}
</style>