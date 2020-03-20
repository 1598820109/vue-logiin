<template>
    <section class="main">



        <div class="container">
            <draggable v-model="doing" :options="dragOptions">
                <transition-group tag="el-table" id="doing" class="item-ul" :data="doing">
                    <div v-for="item in doing" class="drag-list" :key="item._id">
                    </div>
                </transition-group>
            </draggable>
        </div>


    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'draglist',
        data() {
            return {
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                doing: [

                    {
                        __v:0,
                        _id:"5e37dc6740890ad144dc3c78",
                        date:"2020-2-3",
                        imageUrl:"http://localhost:8181/uploads/0369b73369d6fcae98f8227a31da055a",
                        name:"Hexo搭建个人博客并部署到Github"
                    },

                     {
                        __v:0,
                        _id:"5e37dc6740890ad144dc3c78",
                        date:"2020-2-3",
                        imageUrl:"http://localhost:8181/uploads/0369b73369d6fcae98f8227a31da055a",
                        name:"Hexo搭建个人博客并部署到Github32131"
                    },

                     {
                        __v:0,
                        _id:"5e37dc6740890ad144dc3c78",
                        date:"2020-2-3",
                        imageUrl:"http://localhost:8181/uploads/0369b73369d6fcae98f8227a31da055a",
                        name:"Hexo搭建个人博客并部署到Github22222222"
                    },

                     {
                        __v:0,
                        _id:"5e37dc6740890ad144dc3c78",
                        date:"2020-2-3",
                        imageUrl:"http://localhost:8181/uploads/0369b73369d6fcae98f8227a31da055a",
                        name:"Hexo搭建个人博客并部署到Github3333333"
                    },
                    
                ],
            }
        },
        components: {
            draggable
        },
    }

</script>

<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>