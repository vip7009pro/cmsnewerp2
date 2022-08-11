import "./YCSXComponent.scss"
var Barcode = require('react-barcode');

const YCSXComponent = () => {
  return (
    <div className="ycsxcomponent">
      <div className="tieudeycsx">
        <div className="title">생산요청서 - Yêu cầu sản xuất</div>
        <div className="soycsx">
            <div className="ycsxno">
                220617-2FH0078
            </div>
            <div className="ycsxbarcode">
                <Barcode  value="2FH0078" format="CODE128" width={2} height= {50} displayValue={false} background="#fff" lineColor = "black" margin={0}/>            
            </div>            
            
        </div>
      </div>

      <div className="thongtinycsx">
        <div className="text1">1. 요청 정보 Thông tin yêu cầu</div>
        <div className="thongtinyeucau">
            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Người yêu cầu</td>
                        <td>NGUYEN THI THAO</td>                    
                    </tr>
                    <tr>                        
                        <td>Khách hàng</td>
                        <td>Samsung Electronics Vietnam</td>                        
                    </tr>
                    <tr>                       
                        <td>Mã sản phẩm</td>
                        <td>7A07975A</td>
                    </tr>
                    <tr>
                        <td>Tên sản phẩm</td>
                        <td>GH68-41291A_A_SM-W700N</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Số lượng yêu cầu</td>
                        <td>18,000 EA</td>                    
                    </tr>
                    <tr>                        
                        <td>Số lượng tồn</td>
                        <td>20,000 EA</td>                        
                    </tr>
                    <tr>                       
                        <td>Số lượng giao</td>
                        <td>18,000</td>
                    </tr>
                    <tr>
                        <td>Ngày giao dự kiến</td>
                        <td>2022-02-01</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Phân loại sản xuất</td>
                        <td>GC</td>                    
                    </tr>
                    <tr>                        
                        <td>Phân loại giao hàng</td>
                        <td>SK</td>                        
                    </tr>                  
                </tbody>
            </table>

            

        </div>
        <div className="text1">2. 제품 정보 Thông tin sản phẩm</div>
        <div className="thongtinsanpham">
        <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Dài SP</td>
                        <td>28.60mm</td>                    
                    </tr>
                    <tr>                        
                        <td>Rộng SP</td>
                        <td>23.00mm</td>                        
                    </tr>
                    <tr>                       
                        <td>P/D</td>
                        <td>174.00mm</td>
                    </tr>
                    <tr>
                        <td>Số hàng SP</td>
                        <td>1 EA</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Type</td>
                        <td>SHEET</td>                    
                    </tr>
                    <tr>                        
                        <td>SL Packing</td>
                        <td>2,000 EA</td>                        
                    </tr>
                    <tr>                       
                        <td>Số lần in</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Số cột SP</td>
                        <td>1EA</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Khoảng cách hàng</td>
                        <td>3.00mm</td>                    
                    </tr>
                    <tr>                        
                        <td>Khoảng cách cột</td>
                        <td>2.00mm</td>                        
                    </tr>
                    <tr>                       
                        <td>K/C liner trái</td>
                        <td>2.0mm</td>
                    </tr>
                    <tr>
                        <td>K/C liner phải</td>
                        <td>2.0mm</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <td>Hạng mục</td>
                    <td>Thông tin</td>
                </thead>
                <tbody>
                    <tr>
                        <td>Ghi chú</td>
                        <td>Đây là nội dung ghi chú</td>                    
                    </tr>                                  
                </tbody>
            </table>

        </div>
        <div className="text1">2. 제품 정보 Thông tin sản phẩm</div>
        <div className="thongtinvatlieu">
            <table>
                <thead>
                    <td>Mã Liệu</td>
                    <td>Tên Liệu</td>
                    <td>Size Liệu</td>
                    <td>Tồn liệu</td>
                    <td>Tồn block</td>
                    <td>Tổng tồn liệu</td>
                    <td>Ghi chú</td>
                </thead>
                <tbody>
                    <tr>
                        <td>A0009027</td>
                        <td>CK-ART80</td>                    
                        <td>110</td>                    
                        <td>1,500M</td>                    
                        <td>500M</td>                    
                        <td>1,000M</td>                    
                        <td>CNDB</td>                    
                    </tr>
                    <tr>
                        <td>A0009027</td>
                        <td>CK-ART80</td>                    
                        <td>110</td>                    
                        <td>1,500M</td>                    
                        <td>500M</td>                    
                        <td>1,000M</td>                    
                        <td>CNDB</td>                    
                    </tr>
                    <tr>
                        <td>A0009027</td>
                        <td>CK-ART80</td>                    
                        <td>110</td>                    
                        <td>1,500M</td>                    
                        <td>500M</td>                    
                        <td>1,000M</td>                    
                        <td>CNDB</td>                    
                    </tr>
                    <tr>
                        <td>A0009027</td>
                        <td>CK-ART80</td>                    
                        <td>110</td>                    
                        <td>1,500M</td>                    
                        <td>500M</td>                    
                        <td>1,000M</td>                    
                        <td>CNDB</td>                    
                    </tr>
                                  
                </tbody>
            </table>


        </div>

      </div>


    </div>
  )
}

export default YCSXComponent