# Astra's Portfolio

My portfolio website showcasing my projects, experience, and personal interests. Built with HTML, CSS, and JavaScript.

![Portfolio Screenshot](https://github.com/user-attachments/assets/69ce5c3c-b176-4abf-b37d-d062c37c0a13)

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design with smooth animations
- **Portfolio Sections**:
  - About Me
  - Work Experience
  - Projects
  - Education & Technical Skills
  - Personal Interests
  - Contact Information

## 📁 Project Structure

```
AstraPorfolio--master/
├── index.html          # Main portfolio page
├── personal.html       # Personal interests page
├── css/                # Stylesheets
│   ├── style.css       # Main styles
│   ├── bootstrap.css   # Bootstrap framework
│   └── ...
├── js/                 # JavaScript files
│   ├── main.js         # Main JavaScript
│   └── ...
├── images/             # Image assets
└── fonts/              # Font files
```

## 🌐 GitHub Pages Deployment

This portfolio is ready to be deployed on GitHub Pages. Follow these steps:

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `your-username.github.io` (replace `your-username` with your GitHub username)
   - **OR** name it anything you want and deploy from a `docs` folder or `gh-pages` branch

### Step 2: Upload Your Files

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - **Branch: main** (or master)
   - **Folder: / (root)**
5. Click **Save**
6. Your site will be live at: `https://your-username.github.io/repo-name/`

### Option: Using `docs` Folder

If you prefer to keep your source files separate:

1. Create a `docs` folder in your repository
2. Move all website files into the `docs` folder
3. In GitHub Pages settings, select **Source: /docs**

## 🛠️ Local Development

To view the site locally:

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Open `index.html` in your web browser, or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Then visit http://localhost:8000
```

## 📝 Customization

- **Update Personal Information**: Edit `index.html` to update your bio, experience, and projects
- **Change Colors**: Modify CSS variables in `css/style.css`
- **Add Projects**: Update the projects section in `index.html`
- **Update Images**: Replace images in the `images/` folder

## 🎨 Technologies Used

- HTML5
- CSS3
- JavaScript (jQuery)
- Bootstrap
- Font Awesome Icons (via Icomoon)

## 📧 Contact

- **Email**: Astra.k.Nguyen05@outlook.com
- **LinkedIn**: [Astra Nguyen](https://www.linkedin.com/in/astra-n-40b024259)
- **GitHub**: [wkeav](https://github.com/wkeav)

## 📄 License

This project is open source and available under the MIT License.

---

Made with ❤️ by Astra
