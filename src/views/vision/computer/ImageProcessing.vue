<template>
  <div class='app-container' style='background: #fff; min-height: 100%'>
    <el-tabs v-model:activeKey='activeKey' type='card'>
      <el-tab-pane name='1' label='基础功能'>
        <div class='table-operator' style='border-top: 5px'>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.gray, 1)'>灰度化</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.thre, 1)'>二值化</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.logicalAnd, 2)'>逻辑与</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.logicalOr, 2)'>逻辑或</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.logicalNot, 1)'>逻辑非</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.add, 2)'>图像相加</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.subtract, 2)'>图像相减</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.multiply, 2)'>图像相乘</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.divide, 2)'>图像相除</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.flip, 1)'>图像翻转</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.move, 1)'>图像平移</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.rotate, 1)'>图像旋转</el-button>
          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.resize, 1)'>图像缩放</el-button>
        </div>
        <div class=''>
          <Table ref="tableRef">

          </Table>
        </div>
        <div v-show='formShow'>
          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>
            <el-form :model='formData'>
              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
                <el-input v-model='formData.res_name' addon-after='.jpg'/>
              </el-form-item>

              <!--        图像翻转-->
              <el-form-item label="图像翻转" class="labelStyle"/>
              <el-form-item label='翻转方向' :labelCol='labelCol' :wrapperCol='wrapperCol'>
                <el-select v-model='formData.fli_choi' placeholder='请选择翻转方向' style='width: 100%'>
                  <el-option value='horizontal'>水平翻转</el-option>
                  <el-option value='vertical'>垂直翻转</el-option>
                  <el-option value='diagonal'>对角翻转</el-option>
                </el-select>
              </el-form-item>

              <!--        图像平移-->
              <!--        坐标轴移动像素值不能为空！坐标轴移动像素值必须为整数！-->
              <el-form-item label="图像平移" class="labelStyle"/>
              <el-form-item label='坐标轴移动像素值' :labelCol='labelCol' :wrapperCol='wrapperCol'>
                <el-col :span='10'>
                  <el-input placeholder='x轴移动像素值' v-model='formData.move_x'>
                  </el-input>
                </el-col>
                <el-col class='line' :span='2'>,</el-col>
                <el-col :span='10'>
                  <el-input placeholder='y轴移动像素值' v-model='formData.move_y'>
                  </el-input>
                </el-col>
              </el-form-item>

              <!--        图像旋转-->
              <!--        角度不能为空！角度值必须为数字！-->
              <el-form-item label="图像旋转" class="labelStyle"/>
              <el-form-item label='图片旋转角度' :labelCol='labelCol' :wrapperCol='wrapperCol'>
                <el-input v-model='formData.angle'>
                </el-input>
              </el-form-item>

              <!--        图像缩放-->
              <!--        坐标轴放缩倍数必须为数字！坐标轴放缩倍数必须为正实数！-->
              <el-form-item label="图像缩放" class="labelStyle"/>
              <el-form-item label='坐标轴放缩倍数' :labelCol='labelCol' :wrapperCol='wrapperCol'>
                <el-input placeholder='x轴放缩倍数' v-model='formData.size_x'>
                </el-input>
                <el-input placeholder='y轴放缩倍数' v-model='formData.size_y'>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>
          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'
                     @click='basicFunction(formUrl, type, formData)'>处理图像
          </el-button>
        </div>
      </el-tab-pane>
<!--      <el-tab-pane name='2' label='图像分析'>-->
<!--        <div class='table-operator' style='border-top: 5px'>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.histogramGray, 1)'>灰度直方图-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.histogramBgr, 1)'>彩色直方图-->
<!--          </el-button>-->
<!--        </div>-->
<!--        <div class='' v-show='pictureShow'>-->
<!--          <PictureChooseOne ref='pictureSelection'/>-->
<!--        </div>-->
<!--        <div v-show='formShow'>-->
<!--          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>-->
<!--            <el-form :model='formData'>-->
<!--              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.res_name' addon-after='.jpg'/>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>-->
<!--          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'-->
<!--                     @click='basicFunction(formUrl, type, formData)'>处理图像-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane name='3' label='图像分割'>-->
<!--        <div class='table-operator' style='border-top: 5px'>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.roberts, 1)'>Roberts 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sobel, 1)'>Sobel 算子</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.laplacian, 1)'>Laplacian 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.LoG, 1)'>LoG 算子</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.canny, 1)'>Canny 算子</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.houghLines, 1)'>HoughLines-->
<!--            线条变化检测-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.houghLinesP, 1)'>HoughLinesP-->
<!--            线条变化检测-->
<!--          </el-button>-->
<!--        </div>-->
<!--        <div class='' v-show='pictureShow'>-->
<!--          <PictureChooseOne ref='pictureSelection'/>-->
<!--        </div>-->
<!--        <div v-show='formShow'>-->
<!--          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>-->
<!--            <el-form :model='formData'>-->
<!--              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.res_name' addon-after='.jpg'/>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              Roberts 算子，Sobel 算子&ndash;&gt;-->
<!--              <el-form-item label="Roberts 算子，Sobel 算子" class="labelStyle"/>-->
<!--              <el-form-item label='权值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='x权值，推荐0.5' v-model='formData.val1'>-->
<!--                </el-input>-->
<!--                <el-input placeholder='y权值，推荐0.5' v-model='formData.val2'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='偏置值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='推荐0' v-model='formData.exp'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              Laplacian 算子&ndash;&gt;-->
<!--              <el-form-item label="Laplacian 算子" class="labelStyle"/>-->
<!--              <el-form-item label='滤波核数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.kernel_size'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='偏置值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='推荐0' v-model='formData.exp'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='处理核数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.k_size'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              Canny 算子&ndash;&gt;-->
<!--              <el-form-item label="Canny 算子" class="labelStyle"/>-->
<!--              <el-form-item label='滤波核数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.kernel_size'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='偏置值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='推荐0' v-model='formData.exp'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>-->
<!--          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'-->
<!--                     @click='basicFunction(formUrl, type, formData)'>处理图像-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane name='4' label='图像平滑与锐化'>-->
<!--        <div class='table-operator' style='border-top: 5px'>-->
<!--          &lt;!&ndash;          图像平滑&ndash;&gt;-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.smoNeighbourAverage, 1)'>领域平均法-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.smoMedianFilter, 1)'>中值滤波法-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.smoIdealFilter, 1)'>理想低通滤波器-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.smoBarteFilter, 1)'>-->
<!--            巴特沃斯低通滤波器-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.smoExpFilter, 1)'>指数低通滤波器-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          图像锐化&ndash;&gt;-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharRobert, 1)'>Roberts 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharLaplacian, 1)'>Laplacian 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharSobel, 1)'>Sobel 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharPrewitt, 1)'>Prewitt 算子-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharIdealHigh, 1)'>理想低通滤波器-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharBarteFilter, 1)'>-->
<!--            巴特沃斯低通滤波器-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.sharExpFilter, 1)'>指数低通滤波器-->
<!--          </el-button>-->

<!--        </div>-->
<!--        <div class='' v-show='pictureShow'>-->
<!--          <PictureChooseOne ref='pictureSelection'/>-->
<!--        </div>-->
<!--        <div v-show='formShow'>-->
<!--          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>-->
<!--            <el-form :model='formData'>-->
<!--              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.res_name' addon-after='.jpg'/>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              领域平均法，中值滤波法&ndash;&gt;-->
<!--              <el-form-item label="领域平均法，中值滤波法" class="labelStyle"/>-->
<!--              <el-form-item label='核数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.kernel_size'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              理想低通滤波器&ndash;&gt;-->
<!--              <el-form-item label="理想低通滤波器" class="labelStyle"/>-->
<!--              <el-form-item label='阈值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='0～255' v-model='formData.d0'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              巴特沃斯低通滤波器，指数低通滤波器&ndash;&gt;-->
<!--              <el-form-item label="巴特沃斯低通滤波器，指数低通滤波器" class="labelStyle"/>-->
<!--              <el-form-item label='阈值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='0～255' v-model='formData.d0'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='阶数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.rank'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>-->
<!--          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'-->
<!--                     @click='basicFunction(formUrl, type, formData)'>处理图像-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane name='5' label='图像形态学'>-->
<!--        <div class='table-operator' style='border-top: 5px'>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.erode, 1)'>腐蚀</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.dilate, 1)'>膨胀</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.morOpen, 1)'>开运算</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.morClose, 1)'>闭运算</el-button>-->
<!--        </div>-->
<!--        <div class='' v-show='pictureShow'>-->
<!--          <PictureChooseOne ref='pictureSelection'/>-->
<!--        </div>-->
<!--        <div v-show='formShow'>-->
<!--          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>-->
<!--            <el-form :model='formData'>-->
<!--              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.res_name' addon-after='.jpg'/>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              腐蚀，膨胀，开运算，闭运算&ndash;&gt;-->
<!--              <el-form-item label="腐蚀，膨胀，开运算，闭运算" class="labelStyle"/>-->
<!--              <el-form-item label='结构元类型' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-select v-model='formData.kernel_type' placeholder='请选择结构元类型'>-->
<!--                  <el-option value='cross'>十字形</el-option>-->
<!--                  <el-option value='rectangle'>矩形</el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='结构元核数' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.kernel_size'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>-->
<!--          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'-->
<!--                     @click='basicFunction(formUrl, type, formData)'>处理图像-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane name='6' label='图像修复'>-->
<!--        <div class='table-operator' style='border-top: 5px'>-->
<!--          &lt;!&ndash;          添加噪声&ndash;&gt;-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.gaussNoise, 1)'>高斯噪声</el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.saltPepperNoise, 1)'>椒盐噪声-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          图像去噪&ndash;&gt;-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.arithmeticAverageFilter, 1)'>-->
<!--            算数均值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.geometricAverageFilter, 1)'>-->
<!--            几何均值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.harmonicAverageFilter, 1)'>-->
<!--            谐波均值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.minFilter, 1)'>最小值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.maxFilter, 1)'>最大值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.medianFilter, 1)'>中值滤波-->
<!--          </el-button>-->
<!--          <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.rangeFilter, 1)'>频域带通滤波器-->
<!--          </el-button>-->

<!--        </div>-->
<!--        <div class='' v-show='pictureShow'>-->
<!--          <PictureChooseOne ref='pictureSelection'/>-->
<!--        </div>-->
<!--        <div v-show='formShow'>-->
<!--          <div class='step-content' style='margin-left: 20%; margin-right: 20%'>-->
<!--            <el-form :model='formData'>-->
<!--              <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input v-model='formData.res_name' addon-after='.jpg'/>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              椒盐噪声&ndash;&gt;-->
<!--              <el-form-item label="椒盐噪声" class="labelStyle"/>-->
<!--              <el-form-item label='噪声比' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='0.01' v-model='formData.prob'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              算数均值滤波，几何均值滤波，谐波均值滤波&ndash;&gt;-->
<!--              <el-form-item label="算数均值滤波，几何均值滤波，谐波均值滤波" class="labelStyle"/>-->
<!--              <el-form-item label='滤波器大小' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.filter_size_p'>-->
<!--                </el-input>-->
<!--                <el-input placeholder='奇数，推荐3' v-model='formData.filter_size_q'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              &lt;!&ndash;              频域带通滤波器&ndash;&gt;-->
<!--              <el-form-item label="频域带通滤波器" class="labelStyle"/>-->
<!--              <el-form-item label='可通过像素值范围' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-input placeholder='最小值' v-model='formData.min'>-->
<!--                </el-input>-->
<!--                <el-input placeholder="无穷大输入'MAX'" v-model='formData.max'>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label='未通过像素新值' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
<!--                <el-select v-model='formData.color' placeholder='请选择翻转方向' style="width:100%">-->
<!--                  <el-option value='0'>0</el-option>-->
<!--                  <el-option value='255'>255</el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>-->
<!--          <el-button type='primary' style='margin-left: 10px; margin-top: 10px;'-->
<!--                     @click='basicFunction(formUrl, type, formData)'>处理图像-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
      <el-button slot='tabBarExtraContent' type='primary' @click='drawer = true' style='margin-right: 20px;'>
        上传图片
      </el-button>

    </el-tabs>
<!--    <el-drawer-->
<!--        title='上传图片'-->
<!--        :closable='false'-->
<!--        v-model='drawer'-->
<!--        width='700'-->
<!--        @close='onClose'-->
<!--    >-->
<!--      <FileUpload/>-->
<!--    </el-drawer>-->
<!--    <image-processing-modal-->
<!--        ref='modalForm'-->
<!--    ></image-processing-modal>-->
  </div>
</template>

<script setup lang="ts">
import {defineComponent, ref, reactive} from 'vue'
import Table from '@/components/Table/index.vue'
import PictureChooseOne from '@/components/ComputerVision/PictureChooseOne'
import FileUpload from '@/components/ComputerVision/FileUpload'
import ImageProcessingModal from '@/components/ComputerVision/ImageProcessingModal'
import axios from 'axios'

const tableRef= ref()
const activeKey = ref('1')
const drawer = ref(false)
const url = reactive({
  gray: '/basic_func/graying',
  thre: '/basic_func/thresholding',
  logicalAnd: '/basic_func/logical_and',
  logicalOr: '/basic_func/logical_or',
  logicalNot: '/basic_func/logical_not',
  add: '/basic_func/add',
  subtract: '/basic_func/subtract',
  multiply: '/basic_func/multiply',
  divide: '/basic_func/divide',
  flip: '/basic_func/flip',
  move: '/basic_func/move',
  rotate: '/basic_func/rotate',
  resize: '/basic_func/resize',
  histogramGray: '/histogram/gray',
  histogramBgr: '/histogram/bgr',
  roberts: '/segmentation/roberts',
  sobel: '/segmentation/sobel',
  laplacian: '/segmentation/laplacian',
  LoG: '/segmentation/LoG',
  canny: '/segmentation/canny',
  houghLines: '/segmentation/hough_lines',
  houghLinesP: '/segmentation/hough_lines_p',
  smoNeighbourAverage: '/smooth_sharpen/smoo_neighbour_average',
  smoMedianFilter: '/smooth_sharpen/smoo_median_filter',
  smoIdealFilter: '/smooth_sharpen/smoo_ideal_filter',
  smoBarteFilter: '/smooth_sharpen/smoo_barte_filter',
  smoExpFilter: '/smooth_sharpen/smoo_exp_filter',
  sharRobert: '/smooth_sharpen/shar_robert',
  sharLaplacian: '/smooth_sharpen/shar_laplacian',
  sharSobel: '/smooth_sharpen/shar_sobel',
  sharPrewitt: '/smooth_sharpen/shar_prewitt',
  sharIdealHigh: '/smooth_sharpen/shar_ideal_high',
  sharBarteFilter: '/smooth_sharpen/shar_barte_filter',
  sharExpFilter: '/smooth_sharpen/shar_exp_filter',
  erode: '/morphological/erode',
  dilate: '/morphological/dilate',
  morOpen: '/morphological/mor_open',
  morClose: '/morphological/mor_close',
  gaussNoise: '/repair/gauss_noise',
  saltPepperNoise: '/repair/salt_pepper_noise',
  arithmeticAverageFilter: '/repair/arithmetic_average_filter',
  geometricAverageFilter: '/repair/geometric_average_filter',
  harmonicAverageFilter: '/repair/harmonic_average_filter',
  minFilter: '/repair/min_filter',
  maxFilter: '/repair/max_filter',
  medianFilter: '/repair/median_filter',
  rangeFilter: '/repair/range_filter',
})

const selection = ref<any[]>([])
const displayImg = ref('')
const displayImg1 = ref('')
const formShow = ref(false)
const labelCol = {xs: {span: 24}, sm: {span: 5}}
const wrapperCol = {xs: {span: 24}, sm: {span: 16}}
const formData = reactive({
  res_name: '',
  fli_choi: 'horizontal',
  move_x: null,
  move_y: null,
  angle: null,
  size_x: null,
  size_y: null,
  val1: null,
  val2: null,
  exp: null,
  kernel_size: null,
  k_size: null,
  d0: null,
  rank: null,
  kernel_type: 'cross',
  prob: null,
  filter_size_p: null,
  filter_size_q: null,
  min: null,
  max: null,
  color: '0'
})

const formUrl = ref('')
const type = ref(1)

const onClose = () => {
  drawer.value = false
}

const cancel = () => {
  selection.value = []
  displayImg.value = ''
  displayImg1.value = ''
  formShow.value = false
  formData.res_name = ''
  formData.fli_choi = 'horizontal'
  formData.move_x = null
  formData.move_y = null
  formData.angle = null
  formData.size_x = null
  formData.size_y = null
  formData.val1 = null
  formData.val2 = null
  formData.exp = null
  formData.kernel_size = null
  formData.k_size = null
  formData.d0 = null
  formData.rank = null
  formData.kernel_type = 'cross'
  formData.prob = null
  formData.filter_size_p = null
  formData.filter_size_q = null
  formData.min = null
  formData.max = null
  formData.color = '0'
}

// const basicFunction = async (url, type, param) => {
//   this.selection = this.$refs['pictureSelection'].multipleSelection
//   if (type === 1) {
//     if (this.selection.length !== 1) {
//       this.$modal.warning({title: '数量错误', content: '选择的图片数量不是一张！', okText: '确定'})
//       return
//     }
//     this.$refs.modalForm.modal.visible = true
//     this.$refs.modalForm.imgPath = this.selection[0].filePath
//     this.$refs.modalForm.imgType = this.selection[0].fileType
//     console.log('this.$refs.modalForm.imgType', this.$refs.modalForm.imgType)
//     let res_name = this.utils.calculate_res_name(this.formData.res_name)
//     let resultName = this.formData.res_name !== '' ? res_name : this.selection[0].fileName
//     const axios = require('axios')
//     await axios.get(
//         this.constant.data().BaseUrl + url, {
//           params: {
//             img_name: this.selection[0].filePath,
//             result_name: resultName,
//             ...param
//           }
//         }
//     ).then((res) => {
//           this.$refs.modalForm.processResult = {}
//           this.$refs.modalForm.processResult = res.data
//           if (res.data.code === '1') {
//             this.$message.success('图片处理成功！')
//           } else if (res.data.code === '2') {
//             this.$message.error('图片处理失败！')
//           }
//         }
//     )
//   } else if (type === 2) {
//     if (this.selection.length !== 2) {
//       this.$modal.warning({title: '数量错误', content: '选择的图片数量不是两张！', okText: '确定'})
//       return
//     }
//     this.$refs.modalForm.modal.visible = true
//     this.$refs.modalForm.imgPath = this.selection[0].filePath
//     this.$refs.modalForm.imgPath1 = this.selection[1].filePath
//     this.$refs.modalForm.imgType = this.selection[0].fileType
//     this.$refs.modalForm.imgType1 = this.selection[1].fileType
//     let res_name = this.utils.calculate_res_name(this.formData.res_name)
//     let resultName = this.formData.res_name !== '' ? res_name : this.selection[0].fileName
//     const axios = require('axios')
//     await axios.get(
//         this.constant.data().BaseUrl + url, {
//           params: {
//             img_name1: this.selection[0].filePath,
//             img_name2: this.selection[1].filePath,
//             result_name: resultName,
//             ...param
//           }
//         }
//     ).then((res) => {
//           this.$refs.modalForm.processResult = {}
//           this.$refs.modalForm.processResult = res.data
//           this.processResult = res.data
//           if (res.data.code === '1') {
//             this.$message.success('图片处理成功！')
//           } else if (res.data.code === '2') {
//             this.$message.error('图片处理失败！')
//           }
//         }
//     )
//   }
// }
//
const showForm = (url, type) => {
  formUrl.value = url
  type.value = type
  formShow.value = true
}

</script>

<style scoped lang='scss'>
.steps {
  margin-top: 20px;
  margin-bottom: 40px;
}

.step-content {
  margin-top: 20px;
  min-height: 500px;
  text-align: center;
}

.content-img {
  width: auto;
  height: auto;
  max-width: 640px;
  max-height: 480px;
  margin-top: 30px
}

.content-img1 {
  margin-left: 10px;
  width: auto;
  height: auto;
  max-width: 640px;
  max-height: 480px;
  margin-top: 30px
}

.labelStyle {
  font-weight: bold;
  text-align: left;
}
</style>