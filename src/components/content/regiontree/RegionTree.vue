<template>
  <div v-contextmenu:contextmenu style="height:100%">
    <title-display height="100%" class="treeContext">
      <template v-slot:title>区域列表</template>

      <div class="inputwrapper">
        <input v-model="filterText" class="input" />
        <i class="el-icon-search"></i>
      </div>
      <el-tree
        id="tree"
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :highlight-current="true"
        node-key="id"
        accordion
        :filter-node-method="filterNode"
        :default-expanded-keys="[$store.state.regionid]"
        ref="tree"
      >
        <span class="span-ellipsis" slot-scope="{ node, data }">
          <!-- <span :title="node.label" @dblclick="dblclickHandler(data)">{{ node.label }}</span> -->
          <span :title="node.label" @dblclick="$emit('open-all-video',data.id)">{{ node.label }}</span>
        </span>
      </el-tree>
      <slot></slot>
      <!-- sticky布局额外内容显示 -->
      
      <v-contextmenu ref="contextmenu">
        <v-contextmenu-item @click="unFoldAll">展开</v-contextmenu-item>
        <v-contextmenu-item @click="collapseAll">收缩</v-contextmenu-item>
      </v-contextmenu>
    </title-display>
  </div>
</template>
 
<script>
import TitleDisplay from "common/display/TitleDisplay";
import { getRegionSensorTreeData } from 'network/home'

export default {
  name: 'RegionTree',
  props: {
    nodetype: {
      type: String,
      default: ''
    }
  },
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
    TitleDisplay
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$store.state.regionid);
    });
  },
  methods: {
    // 展开
    unFoldAll () {
      // 将没有转换成树的原数据
      let treeList = this.treeData;
      for (let i = 0; i < treeList.length; i++) {
        // 将没有转换成树的原数据设置key为... 的展开
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = true
      }
    },
    // 收缩
    collapseAll () {
      let treeList = this.treeData;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = false
      }
    },
    // 树点击获取regionid
    handleNodeClick (data) {
      // 站房nodetype为40
      if (data.nodetype === '40') {
        this.$store.commit("SET_REGIONNAME", data.name);
        this.$store.commit("SET_REGIONID", data.id);
      }
      // 类型为sensortype，设备为sensor
      this.$emit("nodeClick", data);
    },
    // 过滤选择节点
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1
    },
  },
  created () {
    getRegionSensorTreeData(this.nodetype).then(res => {
      this.treeData = res.data;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.$store.state.regionid);
      });
    })
  }
}
</script>
 
<style lang='scss' scoped>
.inputwrapper {
  padding-left: 17px;
  padding-top: 14px;
  padding-bottom: 25px;
  position: relative;
  position: sticky;
  top: 0;
  z-index: 999;
  i {
    left: 27px;
    top: 19px;
    position: absolute;
    color: #7e86ac;
    font-weight: 900;
  }
  .input {
    width: 244px;
    height: 27px;
    border-radius: 14px;
    background: #1b2c78;
    padding-left: 29px;
    color: #7e86ac;
  }
}
.span-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.contextmenu {
  position: absolute;
  color: #303133;
  background: #fff;
  padding: 8px;
  p {
    cursor: pointer;
  }
}
</style>