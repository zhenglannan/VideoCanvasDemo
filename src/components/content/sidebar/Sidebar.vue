<template>
  <div class="tree" v-show="$route.path!=='/home'">
    <transition name="slide">
      <div v-show="isShow" class="treeContent">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
          node-key="id"
          :filter-node-method="filterNode"
          default-expand-all
          ref="tree"
        ></el-tree>
        <div class="footerBtn">
          <el-button-group>
            <el-button type="primary" size="medium" round @click="expand(true)">展开</el-button>
            <el-button type="primary" size="medium" round @click="expand(false)">关闭</el-button>
          </el-button-group>
        </div>
      </div>
    </transition>
    <div>
      <!-- <div class="showBtn" @click="isShow=!isShow"> -->
      <div class="showBtn" @click="change">
        <span>选择站房</span>
      </div>
    </div>
  </div>
</template>
 
<script>
import { getRegionTree } from 'network/home'
export default {
  name: 'Sidebar',
  data () {
    return {
      isShow: false,
      filterText: '',
      data: null,
      // data: [{
      //   label: '一级 1',
      //   children: [{
      //     label: '二级 1-1',
      //     children: [{
      //       label: '三级 1-1-1'
      //     }]
      //   }]
      // }, {
      //   label: '一级 2',
      //   children: [{
      //     label: '二级 2-1',
      //     children: [{
      //       label: '三级 2-1-1'
      //     }]
      //   }, {
      //     label: '二级 2-2',
      //     children: [{
      //       label: '三级 2-2-1'
      //     }]
      //   }]
      // }, {
      //   label: '一级 3',
      //   children: [{
      //     label: '二级 3-1',
      //     children: [{
      //       label: '三级 3-1-1'
      //     }]
      //   }, {
      //     label: '二级 3-2',
      //     children: [{
      //       label: '三级 3-2-1'
      //     }]
      //   }]
      // }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  methods: {
    // handleNodeClick (data) {
    //   console.log(data);
    // },
    // 过滤选择节点
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1
    },
    // 显示/隐藏侧边栏
    change () {
      this.isShow = !this.isShow;
      // console.log(this.$route);
      // this.$router.push(this.$route.path);
    },
    // 控制展开/关闭树
    expand (boolean) {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = boolean;
      }
    }
  },
  computed: {
    // isExpand () {
    //   return this.exp
    // }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    getRegionTree().then(res => {
      this.data = res.data;
    })
  }
}
</script>
 
<style lang='scss'>
.tree {
  display: flex;
  padding-top: 10px;
  .treeContent {
    position: relative;
    background: #151d4a;
    width: 200px;
    height: 100%;
    .footerBtn {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .showBtn {
    background: orange;
    width: 21px;
    height: 133px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    cursor: pointer;
    z-index: 100;
    span {
      vertical-align: -webkit-baseline-middle;
    }
  }
}
.el-tree {
  background: #151d4a !important;
  color: #ffffff !important;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #100c2a !important;
}
.el-tree-node__content:hover {
  background-color: #100c2a !important;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translate(-200px);
}
</style>