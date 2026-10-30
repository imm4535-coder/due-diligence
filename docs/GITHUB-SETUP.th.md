# เปิด GitHub ให้ Due Diligence

ซอร์ส แอป AI Skill และ MCP ทำแล้ว ขั้นตอนนี้สร้างพื้นที่ปลายทางให้เผยแพร่ได้ ชื่อที่ผู้ใช้เห็นคือ **Due Diligence** และชื่อ repository คือ `due-diligence`.

1. เปิด https://github.com/new?name=due-diligence&description=Evidence-led%20due%20diligence%20app%2C%20AI%20skill%20and%20MCP%20tools&visibility=public และเข้าสู่ระบบ GitHub หากยังไม่ได้เข้า
2. ช่อง **Owner** เลือกบัญชีของคุณ ซึ่งบัญชีที่เชื่อมต่อในงานนี้คือ `imm4535-coder`
3. ช่อง **Repository name** ใส่ `due-diligence`
4. เลือก **Public** เพื่อให้คนอื่นดูโค้ดและดาวน์โหลดได้
5. ให้ **Add a README file** ปิดไว้; **Add .gitignore** เลือก None; **Choose a license** เลือก None เพราะซอร์สเตรียม README, .gitignore และ MIT License ไว้ครบแล้ว
6. กดปุ่ม **Create repository**
7. คัดลอก URL จากแถบที่อยู่ส่งกลับมา เช่น `https://github.com/imm4535-coder/due-diligence`

ถ้า GitHub แจ้งว่าชื่อนี้มีอยู่แล้ว ให้เปิด repository นั้นและส่ง URL มาเพื่อตรวจเนื้อหาก่อน ห้ามลบหรือเขียนทับ repository เดิมเพื่อแก้ปัญหาชื่อซ้ำ

หาก repository ใหม่ยังไม่ปรากฏกับตัวเชื่อมต่อ ให้เปิด https://github.com/settings/installations เลือก GitHub App ที่ใช้เชื่อมกับ ChatGPT/Codex กด **Configure** แล้วเพิ่ม `due-diligence` ในรายการ repository ที่แอปเข้าถึงได้ ชื่อ GitHub App อาจแตกต่างกัน ให้เลือกตัวที่คุณใช้เชื่อมต่อจริง ไม่ต้องส่ง token หรือรหัสผ่านมา

หลังได้รับ URL จะตรวจ repository และสิทธิ์จริงก่อน จากนั้นอัปโหลดซอร์ส ทำ release พร้อม ZIP และเปิด GitHub Pages หากสิทธิ์รองรับ ยังไม่ต้องตั้งค่าบัญชีรับเงิน
