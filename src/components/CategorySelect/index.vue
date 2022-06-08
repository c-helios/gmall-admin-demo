<template>
  <div>
    一级分类
    <el-select v-model="category1Id" placeholder="请选择" style="margin: 0px 10px" :disabled="disabledCategorySelect" @change="getCategoryList(category1Id, 1)">
      <el-option
        v-for="item in categoryList1"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    二级分类
    <el-select v-model="category2Id" placeholder="请选择" style="margin: 0px 10px" :disabled="disabledCategorySelect" @change="getCategoryList(category2Id, 2)">
      <el-option
        v-for="item in categoryList2"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    三级分类
    <el-select v-model="category3Id" placeholder="请选择" style="margin: 0px 10px" :disabled="disabledCategorySelect" @change="getCategoryList(category3Id, 3)">
      <el-option
        v-for="item in categoryList3"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    'disabledCategorySelect': {
      type: Boolean
    }
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      categoryList1: [],
      categoryList2: [],
      categoryList3: []
    }
  },
  mounted() {
    this.getCategoryList1()
  },
  methods: {
    getCategoryList1() {
      this.category1Id = ''
      this.category2Id = ''
      this.category3Id = ''
      this.categoryList2 = []
      this.categoryList3 = []
      this.$Api.category.getCategory1().then(response => {
        this.categoryList1 = response.data
      }).catch(error => {
        this.categoryList1 = []
        this.$message.error(error.message)
      })
    },
    getCategoryList2(category1Id) {
      this.category2Id = ''
      this.category3Id = ''
      this.categoryList3 = []
      this.$Api.category.getCategory2(category1Id).then(response => {
        this.categoryList2 = response.data
      }).catch(error => {
        this.categoryList2 = []
        this.$message.error(error.message)
      })
    },
    getCategoryList3(category2Id) {
      this.category3Id = ''
      this.$Api.category.getCategory3(category2Id).then(response => {
        this.categoryList3 = response.data
      }).catch(error => {
        this.categoryList3 = []
        this.$message.error(error.message)
      })
    },
    getCategoryList(categoryId, level) {
      if (level === 1) {
        this.getCategoryList2(categoryId)
      } else if (level === 2) {
        this.getCategoryList3(categoryId)
      }
      this.$emit('getSelectedCategoryId', categoryId, level)
    }
  }

}
</script>

<style>

</style>
