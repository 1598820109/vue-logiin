<template>
    <div class="center">
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
                <el-input v-model="search" placeholder="用户名" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchItem">搜索</el-button>
            </div>


            <el-table :data="items.slice((query.pageIndex - 1) * query.pageSize,query.pageIndex*query.pageSize)"  border
                class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="_id" label="ID" width="255" align="center"></el-table-column>

                <el-table-column prop="parent.name" label="上级分类" width="120" align="center"></el-table-column>

                <el-table-column prop="name" label="文章分类" width="370" align="center"></el-table-column>

                <el-table-column prop="date" label="注册时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页导航 -->
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
                    :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="model" :model="model" label-width="70px">
                <el-form-item label="上级菜单">
                    <el-select placeholder="请选择分类" v-model="model.parent">
                        <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;getreload();">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->

    </div>
</template>

<script>
    // 引入json文件
    // import { fetchData } from '../../api/index';
    export default {
        name: 'basetable',

        inject: ['reload'],
        // 刷新
        data() {
            return {

                //  数据
                query: {
                    pageIndex: 1,
                    pageSize: 8
                },
                model: {
                },

                // 搜索
                search:'',
                searchData:'',
                items: [],
                parents: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: null,
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
            this.fetch();
        },

        mounted() {
            this.getData();
        },

        computed: {
           
        },

        // watch: {
        //     search(newVal,oldVal){
        //         if(!newVal || !oldVal){
        //             this.getData();
        //         }
        //     }
        // },

        methods: {

            // 获取 分类列表数据
            async getData() {
                const res = await this.$http.get('rest/categories');
                this.items = res.data;
                this.pageTotal = res.data.length;
            },

            // 获取上级分类的数据
            async fetch() {
                const res = await this.$http.get(`rest/categories`);
                this.parents = res.data;
            },


            // 触发搜索按钮
            searchItem() {
                const search = this.search;
                if(search){
                    this.searchData = this.items.filter(function(item){
                        // console.log(item);
                        return Object.keys(item).some(function(key){
                            // console.log(key)
                            return String(item[key]).toLowerCase().indexOf(search)>-1
                        })
                    })
                }else{
                    this.getData();
                }

                this.items = this.searchData;
                // this.getData();
            },

            // 删除操作
            async  handleDelete(row) {
                // 二次确认删除
                this.$confirm(`确定要删除吗？ "${row.name}" `, '提示', {
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$http.delete(`rest/categories/${row._id}`)
                    this.$message({
                        type: "success",
                        message: "删除成功"
                    })
                    this.getData();
                    this.items.splice(index, 1);
                })
                    .catch(() => { });
            },

            // 多选操作
            handleSelectionChange(val, row) {
                // console.log(val);
                this.multipleSelection = val;
            },

            // 多选项删除
            async delAllSelection(row) {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }

                // this.multipleSelection 多选的数据
                console.log(this.multipleSelection)
                for (let i = 0; i < length; i++) {
                    console.log(this.multipleSelection[i]._id)
                }
                // 删除操作
                this.$confirm(`确定要删除吗？${str}`, '提示', {
                    type: 'warning'
                }).then(async () => {
                    for (let i = 0; i < length; i++) {
                        const res = await this.$http.delete(`rest/categories/${this.multipleSelection[i]._id}`)
                    }
                    this.$message({
                        type: "success",
                        message: `删除成功 ${str}`,

                    })
                    this.multipleSelection = [];
                    this.getData();
                    this.items.splice(index, 1);
                })
                    .catch(() => { });
            },

            // 编辑操作
            async handleEdit(index, row) {
                this.idx = index;
                this.model = row;
                this.editVisible = true;
                this.items.splice(index, 1);
                const res = await this.$http.get(`rest/categories/${this.model._id}`);
                this.model.parent = res.data.parent;
                console.log(res.data.parent)
            },

            // 保存编辑
            async saveEdit(row) {
                const res = await this.$http.put(`rest/categories/${this.model._id}`, this.model)
                this.editVisible = false;
                // 重新获取数据
                this.getData();
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.items, this.idx, this.model);

            },

            // 取消编辑
            getreload() {
                this.getData();
            },

            // 分页导航
            handlePageChange(val) {
                this.getData();
                this.$set(this.query, 'pageIndex', val);
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

    button.el-dialog__headerbtn {
        display: none;
    }
</style>