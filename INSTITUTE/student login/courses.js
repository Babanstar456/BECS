// API endpoint - this would be your Node.js backend URL
const API_BASE_URL = 'localhost';

async function fetchUserCourses(uid) {
  try {
    const idToken = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/api/user/${uid}/courses`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

function displayCourses(courses) {
  const container = document.getElementById('courses-container');
  const loading = document.getElementById('loading');
  
  if (courses.length === 0) {
    loading.textContent = 'No courses found.';
    return;
  }
  
  loading.style.display = 'none';
  
  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
      <img src="${course.image_link}" alt="${course.course_name}" class="course-image">
      <div class="course-info">
        <h3>${course.course_name}</h3>
        <p>${course.course_description}</p>
        <p>Purchased: ${new Date(course.purchased_at).toLocaleDateString()}</p>
      </div>
    `;
    container.appendChild(courseCard);
  });
}

// Load courses when page loads
if (document.getElementById('courses-container')) {
  document.addEventListener('DOMContentLoaded', async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const data = await fetchUserCourses(user.uid);
        displayCourses(data.courses);
      } catch (error) {
        document.getElementById('loading').textContent = 'Error loading courses. Please try again.';
      }
    }
  });
}