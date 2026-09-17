 import java.util.Scanner;
// // import java.lang.Math;

// public class Power {
// public static void main(String[] args){
//     Scanner sc =new Scanner(System.in);
//     double a;
//     double b;
//     a= sc.nextDouble();
//     b= sc.nextDouble();
//     double c;
//     c= Math.pow(a,b);
//     System.out.println(c); 
//             sc.close();

// }
    
// import java.util.Scanner;

public class Power {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        double a = sc.nextDouble();
        double b = sc.nextDouble();

        double c = Math.pow(a, b);
        System.out.println(c);

        sc.close();
    }
}
