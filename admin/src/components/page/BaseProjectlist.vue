<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 分类列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.name" placeholder="项目名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>




            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="_id" label="ID" width="240" align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="项目名称" width="300"></el-table-column>
                <el-table-column label="项目地址" align="left" prop="href"></el-table-column>
                <el-table-column prop="date" align="center" label="注册时间" width="100"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
                    :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="model" label-width="70px">

                <el-form-item label="项目名称">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="项目地址">
                    <el-input v-model="model.href"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;getreload()">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                model: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            async getData() {
                const res = await this.$http.get('rest/projects');
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
                this.$confirm(`此操作将永久删除该文件, 是否继续 ? "${row.name}"`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    console.log(row)
                    const res = await this.$http.delete(`rest/projects/${row._id}`);
                    //刷新数据
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => { });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            async delAllSelection(row) {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    console.log(this.multipleSelection[i])
                    str += this.multipleSelection[i].name + ' ';
                }

                this.$confirm(`是否永久删除该链接? "${str}"`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    console.log(row)
                    for (let i = 0; i < length; i++) {
                        const res = await this.$http.delete(`rest/projects/${this.multipleSelection[i]._id}`);
                    }
                    //刷新数据
                    this.getData();
                    this.multipleSelection = [];
                    this.$message.error(`删除了${str}`);
                }).catch(() => { });
            },
            // 编辑操作
            async handleEdit(index, row) {
                this.idx = index;
                this.model = row;
                this.editVisible = true;
                console.log(this.model._id)
                const res = await this.$http.get(`rest/projects/${this.model._id}`)
            },
            // 保存编辑
            async saveEdit(row) {
                this.editVisible = false;
                const res = await this.$http.put(`rest/projects/${this.model._id}`, this.model);
                this.getData();
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.model);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },

            // 取消编辑
            getreload(){
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