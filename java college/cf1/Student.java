public class Student {
    public static void main(String[] args) {
        Person p1 =new Person();
        System.out.println(p1.name+" "+p1.grade);
    }

    
}
class Stu{
    String name="Srinidhi";
    int rollno=153;

}
class Person extends Stu{
    double grade=9.0;
}
