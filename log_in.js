import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Dummy validation (Replace this with database authentication)
        if ("user@example.com".equals(email) && "password123".equals(password)) {
            HttpSession session = request.getSession();
            session.setAttribute("user", email);
            response.sendRedirect("dashboard.html"); // Redirect to dashboard
        } else {
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<script>alert('Invalid Credentials'); window.location.href='index.html';</script>");
        }
    }
}
