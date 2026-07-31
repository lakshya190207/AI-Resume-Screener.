import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

batch_dir = os.path.abspath("d:/Avi/Projects/ai-resume-screener/sample_resumes_batch")
os.makedirs(batch_dir, exist_ok=True)

styles = getSampleStyleSheet()
title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor('#0f172a'))
body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=10, leading=14, textColor=colors.HexColor('#334155'))

# 1. Candidate 01 - PDF (Top Tier AI Engineer)
doc1 = SimpleDocTemplate(os.path.join(batch_dir, "Candidate_01_Alexander_Vance.pdf"), pagesize=letter)
story1 = [
    Paragraph("ALEXANDER VANCE", title_style),
    Paragraph("Email: alex.vance@neuralcloud.io | Phone: (555) 234-5678 | San Francisco, CA", body_style),
    Paragraph("LinkedIn: linkedin.com/in/alex-vance | GitHub: github.com/alexvance | Graduated: Class of 2018", body_style),
    Spacer(1, 10),
    Paragraph("<b>SUMMARY</b><br/>Senior AI Systems Engineer with 6+ years experience in Python, PyTorch, Docker, Kubernetes, TensorRT, and System Architecture.", body_style),
    Spacer(1, 10),
    Paragraph("<b>EXPERIENCE</b><br/>Staff AI Infrastructure Engineer | NeuralCloud Systems (2021 – Present)<br/>- Engineered scalable GPU inference engines with Python, PyTorch, and TensorRT.<br/>- Orchestrated containerized deployment pipelines using Docker and Kubernetes on AWS.<br/>- Built REST APIs and microservice wrappers for deep learning model serving.", body_style),
    Spacer(1, 10),
    Paragraph("<b>EDUCATION</b><br/>B.S. in Computer Science | Stanford University, Class of 2018", body_style)
]
doc1.build(story1)

# 2. Candidate 02 - PDF (Top Tier Full Stack Architect)
doc2 = SimpleDocTemplate(os.path.join(batch_dir, "Candidate_02_Taylor_Chen.pdf"), pagesize=letter)
story2 = [
    Paragraph("TAYLOR CHEN", title_style),
    Paragraph("Email: taylor.chen@devstudio.com | Phone: (212) 555-8899 | New York, NY", body_style),
    Paragraph("GitHub: github.com/tchen-architect | Male | He/Him | Graduated: May 2017", body_style),
    Spacer(1, 10),
    Paragraph("<b>SUMMARY</b><br/>Lead Full-Stack Architect with 7 years enterprise web experience. Expert in React, Node.js, TypeScript, PostgreSQL, and System Design.", body_style),
    Spacer(1, 10),
    Paragraph("<b>EXPERIENCE</b><br/>Principal Full-Stack Engineer | Nexus Enterprise (2020 – Present)<br/>- Architected enterprise React and TypeScript frontends supporting 500k concurrent active users.<br/>- Designed Node.js microservices with PostgreSQL and GraphQL APIs.<br/>- Implemented Redis caching and Tailwind CSS design system components.", body_style),
    Spacer(1, 10),
    Paragraph("<b>EDUCATION</b><br/>B.S. Computer Engineering | MIT, Graduated 2017", body_style)
]
doc2.build(story2)

# 3. Candidate 03 - TXT (Qualified Candidate)
with open(os.path.join(batch_dir, "Candidate_03_Jordan_Rivera.txt"), "w", encoding="utf-8") as f:
    f.write("""JORDAN RIVERA
Email: jordan.rivera.dev@gmail.com | Phone: 415-987-6543
LinkedIn: linkedin.com/in/jrivera-dev | She/Her | Graduation: 2020

SUMMARY
Software Engineer with 4 years experience building Python backends and REST APIs. Strong foundation in Docker and AWS with growing experience in PyTorch.

EXPERIENCE
Backend Engineer | DataScale Tech (2021 – Present)
- Designed REST APIs in Python using FastAPI and Docker.
- Integrated PostgreSQL and Redis caching layers.

EDUCATION
B.S. Software Engineering | UT Austin, 2020""")

# 4. Candidate 04 - TXT (Product Marketing Manager)
with open(os.path.join(batch_dir, "Candidate_04_Morgan_Bennett.txt"), "w", encoding="utf-8") as f:
    f.write("""MORGAN BENNETT
Email: morgan.b@enterprise-design.org | Phone: 312-555-0199
Female | Age: 38 | Graduated: 2012

SUMMARY
Senior Product Marketing Manager with 6 years experience in Go-to-Market Strategy, Competitive Intelligence, Content Creation, and Analytics.

EXPERIENCE
Product Marketing Manager | MarketGrowth Inc (2019 – Present)
- Led multi-channel GTM campaigns resulting in 200% ARR growth.
- Conducted competitive intelligence and customer interviewing.

EDUCATION
B.A. Marketing | Northwestern University, 2012""")

# 5. Candidate 05 - TXT (Not a Match Candidate)
with open(os.path.join(batch_dir, "Candidate_05_Sam_Taylor.txt"), "w", encoding="utf-8") as f:
    f.write("""SAM TAYLOR
Email: sam.taylor@design-studio.com | Phone: 555-019-9988
Non-Binary | Graduated: 2014

EXPERIENCE
Lead UI/UX Designer | Creative Design Studio (2016 – Present)
- 8 years experience in Figma, Adobe XD, HTML, CSS, and user research.

SKILLS: Figma, User Research, Wireframing, HTML, CSS

EDUCATION
B.A. Fine Arts, 2014""")

print("Successfully created 5 sample batch resume files in:", batch_dir)
