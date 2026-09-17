public class Overridee {
    public static void main(String[] args) {
    //     Demo d1=new Demo();
    //     NewDemo d2=new NewDemo();
    //     d1.Trial();
    //     d2.Trial();
    Overridee obj=new Overridee();
     
    System.out.println(obj.toString());        
    }
    public String toString(){
            return "hello";
        }
}
// class Demo{
//      void Trial(){
//         System.out.println("This is my trial class");
//      }
//     }
// class NewDemo extends Demo{
//     void Trial(){
//         System.out.println("this is extended class");
//     }
// }
