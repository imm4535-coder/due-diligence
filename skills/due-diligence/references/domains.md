# Domain screening modules

Starter questions only. Add specialist questions and jurisdiction-specific requirements for the actual scope.

## Strategy & market / กลยุทธ์และตลาด

- **strategy.market** มีหลักฐานความต้องการของลูกค้าและขนาดตลาดหรือไม่?
  Evidence to seek: ข้อมูลลูกค้า งานวิจัยตลาด และสมมติฐานที่ตรวจสอบได้
- **strategy.competition** ข้อได้เปรียบและคู่แข่งสำคัญได้รับการตรวจสอบหรือไม่?
  Evidence to seek: ข้อมูลราคา คู่แข่ง และเหตุผลที่ลูกค้าเลือก
- **strategy.economics** โมเดลรายได้และต้นทุนต่อหน่วยอยู่ได้ภายใต้กรณีแย่หรือไม่?
  Evidence to seek: สมมติฐานรายได้ ต้นทุน และ sensitivity analysis

## Finance & tax / การเงินและภาษี

- **finance.cash** รายได้ เงินสด และหนี้ตรงกับเอกสารต้นทางหรือไม่?
  Evidence to seek: งบการเงิน รายการธนาคาร ตารางหนี้ และ reconciliation
- **finance.runway** สภาพคล่องเพียงพอเมื่อรายได้ลดลงหรือไม่?
  Evidence to seek: กระแสเงินสด ภาระผูกพัน และ downside scenario
- **finance.tax** ภาษีและรายการกับบุคคลที่เกี่ยวข้องครบถ้วนหรือไม่?
  Evidence to seek: แบบภาษี รายการเกี่ยวโยง และผู้เชี่ยวชาญภาษี

## Legal & contracts / กฎหมายและสัญญา

- **legal.ownership** นิติบุคคล ผู้ถือหุ้น และอำนาจลงนามยืนยันได้หรือไม่?
  Evidence to seek: ทะเบียนนิติบุคคล โครงสร้างผู้ถือหุ้น และมติที่เกี่ยวข้อง
- **legal.contracts** สัญญาสำคัญมีข้อจำกัดหรือภาระที่เปลี่ยนการตัดสินใจหรือไม่?
  Evidence to seek: สัญญาฉบับลงนาม วันครบกำหนด และข้อ change of control
- **legal.disputes** คดี ข้อพิพาท และใบอนุญาตตรวจครบตามพื้นที่หรือไม่?
  Evidence to seek: ทะเบียนคดี ใบอนุญาต และความเห็นที่ปรึกษาในเขตอำนาจ

## Technology & AI / เทคโนโลยีและ AI

- **technology.architecture** ระบบและต้นทุนรองรับปริมาณงานที่คาดไว้หรือไม่?
  Evidence to seek: แผนผังระบบ ผล load test ต้นทุน และแผนกู้คืน
- **technology.ip** สิทธิ์ในซอฟต์แวร์ ข้อมูล โมเดล และ dependency ชัดเจนหรือไม่?
  Evidence to seek: ทะเบียน IP ใบอนุญาต และ software bill of materials
- **technology.ai** AI มีการประเมินข้อผิดพลาด ขอบเขตใช้งาน และคนรับผิดชอบหรือไม่?
  Evidence to seek: ชุดประเมิน เกณฑ์ยอมรับ model/data provenance และ human override

## Cybersecurity / ความปลอดภัยไซเบอร์

- **security.access** สิทธิ์เข้าถึงและ secret ถูกควบคุมและทบทวนหรือไม่?
  Evidence to seek: access review, MFA และแนวทางเก็บ secret
- **security.vulnerabilities** ช่องโหว่และเหตุการณ์สำคัญมีหลักฐานการแก้ไขหรือไม่?
  Evidence to seek: ผลตรวจ วันแก้ไข และการทดสอบซ้ำ
- **security.recovery** กู้คืนข้อมูลและตอบสนองเหตุการณ์ได้จริงหรือไม่?
  Evidence to seek: ผล restore test แผนตอบสนอง และผู้รับผิดชอบ

## Privacy & data / ข้อมูลส่วนบุคคล

- **privacy.basis** การใช้ข้อมูลมีฐานทางกฎหมายและวัตถุประสงค์ชัดเจนหรือไม่?
  Evidence to seek: data inventory, lawful basis และ notice ตามเขตอำนาจ
- **privacy.processors** ผู้ประมวลผลและการโอนข้อมูลมีข้อตกลงครบหรือไม่?
  Evidence to seek: DPA, subprocessor register และข้อกำหนดการโอนข้อมูล
- **privacy.retention** การลบข้อมูลและคำขอเจ้าของข้อมูลทำได้จริงหรือไม่?
  Evidence to seek: retention schedule และหลักฐานทดสอบคำขอ/ลบข้อมูล

## Operations & quality / ปฏิบัติการและคุณภาพ

- **operations.process** กระบวนการหลักมีเจ้าของและผลลัพธ์วัดได้หรือไม่?
  Evidence to seek: SOP, KPI, defect log และความรับผิดชอบ
- **operations.continuity** มีแผนเมื่อคน ระบบ หรือซัพพลายเออร์หลักหยุดงานหรือไม่?
  Evidence to seek: BCP และผลทดสอบสถานการณ์หยุดชะงัก
- **operations.capacity** คุณภาพและกำลังผลิตรองรับแผนเติบโตหรือไม่?
  Evidence to seek: ข้อมูล lead time กำลังผลิต และผล audit คุณภาพ

## People & governance / บุคลากรและธรรมาภิบาล

- **people.keyperson** ความเสี่ยงพึ่งพาบุคคลสำคัญมีแผนรับมือหรือไม่?
  Evidence to seek: บทบาท แผนสืบทอด และการส่งต่อความรู้
- **people.employment** สัญญาจ้าง ค่าตอบแทน และข้อพิพาทแรงงานครบถ้วนหรือไม่?
  Evidence to seek: สัญญา payroll และข้อกำหนดแรงงานท้องถิ่น
- **people.conflicts** ผลประโยชน์ทับซ้อนและการกำกับดูแลเปิดเผยหรือไม่?
  Evidence to seek: ทะเบียนผลประโยชน์ มติ และช่องทางแจ้งปัญหา

## Customers & revenue / ลูกค้าและรายได้

- **commercial.concentration** การพึ่งพาลูกค้ารายใหญ่และ churn ตรวจสอบแล้วหรือไม่?
  Evidence to seek: รายได้แยกลูกค้า cohort และสัญญา renewal
- **commercial.pipeline** ยอดขายและ pipeline ยืนยันกับหลักฐานต้นทางได้หรือไม่?
  Evidence to seek: ใบสั่งซื้อ invoice CRM และรายการรับชำระ
- **commercial.promises** คำโฆษณา SLA และข้อร้องเรียนมีภาระที่ยังไม่รับรู้หรือไม่?
  Evidence to seek: นโยบายคืนเงิน SLA และข้อร้องเรียน

## Vendors & supply chain / คู่ค้าและห่วงโซ่อุปทาน

- **vendor.identity** ตัวตน ผู้รับประโยชน์ และบัญชีรับเงินคู่ค้ายืนยันได้หรือไม่?
  Evidence to seek: ทะเบียนบริษัท ownership และการยืนยันบัญชีผ่านช่องทางอิสระ
- **vendor.dependency** คู่ค้าหลักมีความเสี่ยงหยุดส่งมอบหรือผูกขาดหรือไม่?
  Evidence to seek: สัญญา capacity และแหล่งจัดหาทดแทน
- **vendor.compliance** ข้อกำหนดด้านการค้าและการต่อต้านทุจริตตรวจตามพื้นที่หรือไม่?
  Evidence to seek: แหล่งทางการที่เป็นปัจจุบันและผลตรวจโดยผู้มีอำนาจ

## Environment & social / สิ่งแวดล้อมและสังคม

- **esg.environment** ภาระสิ่งแวดล้อมและใบอนุญาตตรวจสอบแล้วหรือไม่?
  Evidence to seek: ผลตรวจพื้นที่ ใบอนุญาต และประวัติเหตุการณ์
- **esg.labor** ความปลอดภัยและสิทธิแรงงานในห่วงโซ่ได้รับการตรวจหรือไม่?
  Evidence to seek: incident log และผล audit ที่ตรวจย้อนกลับได้
- **esg.claims** คำกล่าวอ้างความยั่งยืนมีวิธีวัดและหลักฐานหรือไม่?
  Evidence to seek: ข้อมูลต้นทาง ขอบเขตการวัด และการรับรอง

## Projects & assets / โครงการและสินทรัพย์

- **project.title** สิทธิในสินทรัพย์ ภาระผูกพัน และข้อจำกัดการใช้งานยืนยันได้หรือไม่?
  Evidence to seek: เอกสารสิทธิ การตรวจทะเบียน และใบอนุญาตตามพื้นที่
- **project.delivery** งบ เวลา และความเสี่ยงโครงการมี baseline และเจ้าของหรือไม่?
  Evidence to seek: แผนงาน งบ contingency และ risk register
- **project.acceptance** เกณฑ์รับมอบและผลตอบแทนผ่าน downside scenario หรือไม่?
  Evidence to seek: acceptance criteria, inspection และ sensitivity analysis
