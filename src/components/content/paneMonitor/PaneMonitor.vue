<template>
  <div class="monitorWrapper">
    <div class="btnGroup">
      <slot></slot>
    </div>
    <div class="regionname">{{$store.state.regionname}}</div>
    <el-row>
      <el-col :span="4">
        <div class="tree">
          <div class="title">
            <span>区域选择</span>
          </div>
          <div class="treeContent">
            <div class="inputwrapper">
              <input v-model="filterText" class="input" />
              <i class="el-icon-search"></i>
            </div>
            <div v-contextmenu:contextmenu style="height:100%">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :highlight-current="true"
                node-key="id"
                :filter-node-method="filterNode"
                :indent="7"
                default-expand-all
                ref="tree"
              >
                <span class="span-ellipsis" slot-scope="{ node, data }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <router-view></router-view>
      </el-col>
    </el-row>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="unFoldAll">展开</v-contextmenu-item>
      <v-contextmenu-item @click="collapseAll">收缩</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
 
<script>
import Button from "components/common/button/Button";
import { getRegionSensorTreeData } from 'network/home'
export default {
  name: 'EnvMonitor',
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: []
    };
  },
  components: {
    Button
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$refs.tree.setCurrentKey(this.$store.state.regionid);
    // })
  },
  methods: {
    // 展开
    unFoldAll () {
      // 将没有转换成树的原数据
      let treeList = this.treeData;
      for (let i = 0, len = treeList.length; i < len; i++) {
        // 将没有转换成树的原数据设置key为... 的展开
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = true
      }
    },
    // 收缩
    collapseAll () {
      let treeList = this.treeData;
      for (let i = 0, len = treeList.length; i < len; i++) {
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = false
      }
    },
    // 树点击获取regionid
    handleNodeClick (data) {
      // 根节点才获取区域id
      if (data.nodetype === '40') {
        this.$store.commit("SET_REGIONID", data.id);
        this.$store.commit("SET_REGIONNAME", data.name);
      }
    },
    // 过滤选择节点
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1
    },
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    getRegionSensorTreeData().then(res => {
      this.treeData = res.data;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.$store.state.regionid);
      })
    })
  }
}
</script>
 
<style lang='scss' scoped>
.monitorWrapper {
  height: 100%;
  .btnGroup {
    position: absolute;
    top: 121px;
    left: 340px;
    z-index: 9;
    // padding-top: 39px;
    // padding-left: 62px;
    .topBtn {
      display: inline-block;
      &:last-child {
        margin-left: 24px;
      }
    }
  }
  .regionname {
    background: url("~assets/image/env/name.png");
    width: 494px;
    height: 50px;
    color: #fff;
    line-height: 50px;
    position: absolute;
    left: 726px;
    top: 175px;
    text-align: center;
    font-size: 17px;
    letter-spacing: 7px;
  }
  .tree {
    background: url("~assets/image/env/left.png");
    height: 900px;
    display: flex;
    flex-direction: column;
    padding: 52px 21px;
    .title {
      width: 146px;
      height: 32px;
      background: url("~assets/image/env/treetitle.png");
      // margin-left: 21px;
      // margin-top: 107px;
      span {
        color: #bfe1ff;
        line-height: 32px;
        padding-left: 45px;
        letter-spacing: 2px;
        font-size: 22px;
        font-family: PingFangSC-Medium;
      }
    }
    .treeContent {
      position: relative;
      // background: #151d4a;
      // width: 200px;
      height: 100%;
      width: 251px;
      // overflow: hidden;
      // overflow-y: auto;
      .inputwrapper {
        padding-left: 26px;
        padding-top: 35px;
        padding-bottom: 25px;
        position: sticky;
        top: 0;
        z-index: 999;
        i {
          left: -26px;
          position: relative;
          color: #7e86ac;
          font-weight: 900;
        }
        .input {
          width: 160px;
          height: 27px;
          border-radius: 14px;
          background: #1b2c78;
          color: #7e86ac;
        }
      }
      .span-ellipsis {
        overflow: hidden;
        word-wrap: none;
        text-overflow: ellipsis;
      }
    }
  }
}
// .el-tree {
//   background: transparent;
//   color: #79c0ff;
// }
// .el-tree-node__content:hover {
//   background: linear-gradient(90deg, #162cad 0%, #022479 100%) !important;
// }
</style>
<style>
/* #EnvMonitor .el-tree {
  height: calc(100% - 90px);
} */
</style>