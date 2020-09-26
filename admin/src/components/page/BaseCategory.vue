<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" label-width="80px" @submit.native.prevent="save">

                    <el-form-item label="上级菜单">
                        <el-select placeholder="请选择分类" v-model="model.parent">
                            <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文章分类">
                        <el-input v-model="model.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'baseform',

        inject: ['reload'],
        data() {
            return {
                // 分类名称
                model: {},
                // 上级分类
                parents: [],


            };
        },

        methods: {

            async save() {
                const res = await this.$http.post('rest/categories', this.model);
                this.reload();
                this.$router.push('table')
                this.$message({
                    type: "success",
                    message: "添加成功",
                })
            },

            async fatch() {
                const res = await this.$http.get(`rest/categories`);
                // 筛选分类
                res.data.forEach((item,index)=>{
                    if(item.parent == undefined){
                        this.parents.push(item);
                    }
                })
            }

        },

        // 生命钩子
        created() {
            this.fatch();
        }
    };
</script>